import { EventEmitter } from "node:events"
import WebSocket from "ws"
import { Plugin } from "../../abstracts/Plugin.js"
import type { Client } from "../../classes/Client.js"
import {
	GatewayCloseCodes,
	GatewayOpcodes,
	type GatewayPayload,
	type GatewayPluginOptions,
	type GatewayState,
	type ReadyEventData
} from "./types.js"
import { startHeartbeat, stopHeartbeat } from "./utils/heartbeat.js"
import { type ConnectionMetrics, ConnectionMonitor } from "./utils/monitor.js"
import {
	createIdentifyPayload,
	createResumePayload,
	validatePayload
} from "./utils/payload.js"

interface HelloData {
	heartbeat_interval: number
}

export class GatewayPlugin extends Plugin {
	protected id = "gateway"
	protected client?: Client
	protected config: GatewayPluginOptions
	protected state: GatewayState
	protected ws: WebSocket | null = null
	protected monitor: ConnectionMonitor
	public heartbeatInterval?: NodeJS.Timeout
	public sequence: number | null = null
	public lastHeartbeatAck = true
	protected emitter: EventEmitter
	private reconnectAttempts = 0
	public shardId?: number
	public totalShards?: number

	constructor(options: GatewayPluginOptions) {
		super()
		this.config = {
			url: "wss://gateway.discord.gg/?v=10&encoding=json",
			reconnect: {
				maxAttempts: 5,
				baseDelay: 1000,
				maxDelay: 30000
			},
			...options
		}
		this.state = {
			sequence: null,
			sessionId: null,
			resumeGatewayUrl: null
		}
		this.monitor = new ConnectionMonitor()
		this.emitter = new EventEmitter()

		this.monitor.on("metrics", (metrics: ConnectionMetrics) =>
			this.emitter.emit("metrics", metrics)
		)
		this.monitor.on("warning", (warning: string) =>
			this.emitter.emit("warning", warning)
		)
	}

	public registerClient(client: Client): void {
		this.client = client
		this.connect()
	}

	public connect(resume = false): void {
		const url =
			resume && this.state.resumeGatewayUrl
				? this.state.resumeGatewayUrl
				: (this.config.url ?? "wss://gateway.discord.gg/?v=10&encoding=json")
		this.ws = this.createWebSocket(url)
		this.setupWebSocket()

		this.ws.on("close", () => {
			this.reconnectAttempts++
			const backoffTime = Math.min(1000 * 2 ** this.reconnectAttempts, 30000)
			setTimeout(() => this.connect(resume), backoffTime)
		})
	}

	public disconnect(): void {
		stopHeartbeat(this)
		this.ws?.close()
		this.ws = null
		this.monitor.destroy()
	}

	protected createWebSocket(url: string): WebSocket {
		if (!url) {
			throw new Error("Gateway URL is required")
		}
		return new WebSocket(url)
	}

	protected setupWebSocket(): void {
		if (!this.ws) return

		this.ws.on("open", () => {
			this.reconnectAttempts = 0
			this.emitter.emit("debug", "WebSocket connection opened")
		})

		this.ws.on("message", (data: WebSocket.Data) => {
			this.monitor.recordMessageReceived()

			const payload = validatePayload(data.toString())
			if (!payload) {
				this.monitor.recordError()
				this.emitter.emit(
					"error",
					new Error("Invalid gateway payload received")
				)
				return
			}

			const { op, d, s, t } = payload

			if (s) this.sequence = s

			switch (op) {
				case GatewayOpcodes.Hello: {
					const helloData = d as HelloData
					const interval = helloData.heartbeat_interval
					startHeartbeat(this, {
						interval,
						reconnectCallback: () => this.handleZombieConnection()
					})

					if (this.canResume()) {
						this.resume()
					} else {
						this.identify()
					}
					break
				}

				case GatewayOpcodes.HeartbeatAck:
					this.lastHeartbeatAck = true
					this.monitor.recordHeartbeatAck()
					break

				case GatewayOpcodes.Dispatch: {
					if (t === "READY") {
						const readyData = d as ReadyEventData
						this.state.sessionId = readyData.session_id
						this.state.resumeGatewayUrl = readyData.resume_gateway_url
					}
					if (t && this.client) {
						// @ts-expect-error - the types are really annoying here, but they are correct technically
						this.client.eventHandler.handleEvent(d, t)
					}
					break
				}

				case GatewayOpcodes.InvalidSession: {
					const canResume = Boolean(d)
					setTimeout(() => {
						if (canResume && this.canResume()) {
							this.connect(true)
						} else {
							this.state.sessionId = null
							this.state.resumeGatewayUrl = null
							this.sequence = null
							this.connect(false)
						}
					}, 5000)
					break
				}

				case GatewayOpcodes.Reconnect:
					this.handleReconnect()
					break
			}
		})

		this.ws.on("close", (code: number) => {
			this.emitter.emit(
				"debug",
				`WebSocket connection closed with code ${code}`
			)
			this.monitor.recordReconnect()
			this.handleClose(code)
		})

		this.ws.on("error", (error: Error) => {
			this.monitor.recordError()
			this.emitter.emit("error", error)
		})
	}

	protected handleClose(code: number): void {
		const {
			maxAttempts = 5,
			baseDelay = 1000,
			maxDelay = 30000
		} = this.config.reconnect ?? {}

		if (this.reconnectAttempts >= maxAttempts) {
			this.emitter.emit(
				"error",
				new Error(
					`Max reconnect attempts (${maxAttempts}) reached after code ${code}`
				)
			)
			return
		}

		switch (code) {
			case GatewayCloseCodes.AuthenticationFailed:
			case GatewayCloseCodes.InvalidAPIVersion:
			case GatewayCloseCodes.InvalidIntents:
			case GatewayCloseCodes.DisallowedIntents:
			case GatewayCloseCodes.ShardingRequired: {
				this.emitter.emit("error", new Error(`Fatal Gateway error: ${code}`))
				this.reconnectAttempts = maxAttempts
				break
			}

			case GatewayCloseCodes.InvalidSeq:
			case GatewayCloseCodes.SessionTimedOut: {
				this.state.sessionId = null
				this.state.resumeGatewayUrl = null
				this.sequence = null
				this.reconnectAttempts++
				const backoffTime = Math.min(
					baseDelay * 2 ** this.reconnectAttempts,
					maxDelay
				)
				this.emitter.emit(
					"debug",
					`Reconnecting with backoff: ${backoffTime}ms after code ${code}`
				)
				setTimeout(() => this.connect(false), backoffTime)
				break
			}

			default: {
				this.reconnectAttempts++
				const resumeBackoffTime = Math.min(
					baseDelay * 2 ** this.reconnectAttempts,
					maxDelay
				)
				this.emitter.emit(
					"debug",
					`Attempting resume with backoff: ${resumeBackoffTime}ms after code ${code}`
				)
				setTimeout(() => this.connect(this.canResume()), resumeBackoffTime)
			}
		}
	}

	protected handleZombieConnection(): void {
		this.monitor.recordZombieConnection()
		this.disconnect()
		this.connect(this.canResume())
	}

	protected handleReconnect(): void {
		this.disconnect()
		this.connect(this.canResume())
	}

	protected canResume(): boolean {
		return Boolean(this.state.sessionId && this.sequence)
	}

	protected resume(): void {
		if (!this.client || !this.state.sessionId || this.sequence === null) return
		const payload = createResumePayload({
			token: this.client.options.token,
			sessionId: this.state.sessionId,
			sequence: this.sequence
		})
		this.send(payload)
	}

	public send(payload: GatewayPayload): void {
		if (this.ws && this.ws.readyState === 1) {
			this.ws.send(JSON.stringify(payload))
			this.monitor.recordMessageSent()
		}
	}

	protected identify(): void {
		if (!this.client) return
		const payload = createIdentifyPayload({
			token: this.client.options.token,
			intents: this.config.intents,
			properties: {
				os: process.platform,
				browser: "@buape/carbon - https://carbon.buape.com",
				device: "@buape/carbon - https://carbon.buape.com"
			},
			...(this.config.shard ? { shard: this.config.shard } : {})
		})
		this.send(payload)
	}
}
