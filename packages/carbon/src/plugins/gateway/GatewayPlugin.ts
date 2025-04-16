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
	type ReadyEventData,
	type APIGatewayBotInfo
} from "./types.js"
import { startHeartbeat, stopHeartbeat } from "./utils/heartbeat.js"
import { type ConnectionMetrics, ConnectionMonitor } from "./utils/monitor.js"
import {
	createIdentifyPayload,
	createResumePayload,
	validatePayload
} from "./utils/payload.js"
import { ListenerEvent, type ListenerEventType } from "../../types/index.js"
import type { GatewayDispatchPayload } from "discord-api-types/v10"

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
	protected gatewayInfo?: APIGatewayBotInfo

	constructor(options: GatewayPluginOptions, gatewayInfo?: APIGatewayBotInfo) {
		super()
		this.config = {
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
		this.gatewayInfo = gatewayInfo

		this.monitor.on("metrics", (metrics: ConnectionMetrics) =>
			this.emitter.emit("metrics", metrics)
		)
		this.monitor.on("warning", (warning: string) =>
			this.emitter.emit("warning", warning)
		)
	}

	public async registerClient(client: Client): Promise<void> {
		this.client = client

		if (!this.gatewayInfo) {
			try {
				const response = await fetch(
					"https://discord.com/api/v10/gateway/bot",
					{
						headers: {
							Authorization: `Bot ${client.options.token}`
						}
					}
				)
				this.gatewayInfo = (await response.json()) as APIGatewayBotInfo
			} catch (error) {
				throw new Error(
					`Failed to get gateway information from Discord: ${error instanceof Error ? error.message : String(error)}`
				)
			}
		}

		this.connect()
	}

	public connect(resume = false): void {
		const url =
			resume && this.state.resumeGatewayUrl
				? this.state.resumeGatewayUrl
				: (this.gatewayInfo?.url ??
					this.config.url ??
					"wss://gateway.discord.gg/?v=10&encoding=json")
		this.ws = this.createWebSocket(url)
		this.setupWebSocket()
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
					const payload1 = payload as GatewayDispatchPayload
					const t1 = payload1.t as ListenerEventType
					if (!Object.values(ListenerEvent).includes(t1))
						throw new Error(`Unknown event type: ${t1}`)
					if (t1 === "READY") {
						const readyData = d as ReadyEventData
						this.state.sessionId = readyData.session_id
						this.state.resumeGatewayUrl = readyData.resume_gateway_url
					}
					if (t && this.client) {
						if (!this.config.eventFilter || this.config.eventFilter?.(t1)) {
							this.client.eventHandler.handleEvent(payload1.d, t1)
						}
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

	protected handleReconnectionAttempt(options: {
		code?: number
		isZombieConnection?: boolean
		forceNoResume?: boolean
	}): void {
		const {
			maxAttempts = 5,
			baseDelay = 1000,
			maxDelay = 30000
		} = this.config.reconnect ?? {}

		if (this.reconnectAttempts >= maxAttempts) {
			this.emitter.emit(
				"error",
				new Error(
					`Max reconnect attempts (${maxAttempts}) reached${options.code ? ` after code ${options.code}` : ""}`
				)
			)
			return
		}

		if (options.code) {
			switch (options.code) {
				case GatewayCloseCodes.AuthenticationFailed:
				case GatewayCloseCodes.InvalidAPIVersion:
				case GatewayCloseCodes.InvalidIntents:
				case GatewayCloseCodes.DisallowedIntents:
				case GatewayCloseCodes.ShardingRequired: {
					this.emitter.emit(
						"error",
						new Error(`Fatal Gateway error: ${options.code}`)
					)
					this.reconnectAttempts = maxAttempts
					return
				}

				case GatewayCloseCodes.InvalidSeq:
				case GatewayCloseCodes.SessionTimedOut: {
					this.state.sessionId = null
					this.state.resumeGatewayUrl = null
					this.sequence = null
					options.forceNoResume = true
					break
				}
			}
		}

		this.reconnectAttempts++
		const backoffTime = Math.min(
			baseDelay * 2 ** this.reconnectAttempts,
			maxDelay
		)

		if (options.isZombieConnection) {
			this.monitor.recordZombieConnection()
		}

		this.disconnect()

		const shouldResume = !options.forceNoResume && this.canResume()
		this.emitter.emit(
			"debug",
			`${shouldResume ? "Attempting resume" : "Reconnecting"} with backoff: ${backoffTime}ms${options.code ? ` after code ${options.code}` : ""}`
		)

		setTimeout(() => this.connect(shouldResume), backoffTime)
	}

	protected handleClose(code: number): void {
		this.handleReconnectionAttempt({ code })
	}

	protected handleZombieConnection(): void {
		this.handleReconnectionAttempt({ isZombieConnection: true })
	}

	protected handleReconnect(): void {
		this.handleReconnectionAttempt({})
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
