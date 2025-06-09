import { EventEmitter } from "node:events"
import type { GatewayDispatchPayload } from "discord-api-types/v10"
import WebSocket from "ws"
import { Plugin } from "../../abstracts/Plugin.js"
import type { Client } from "../../classes/Client.js"
import { ListenerEvent, type ListenerEventType } from "../../types/index.js"
import {
	type APIGatewayBotInfo,
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
	readonly id = "gateway"
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

		// Set shard information on the client
		if (this.config.shard) {
			client.shardId = this.config.shard[0]
			client.totalShards = this.config.shard[1]
		}

		this.connect()
	}

	public connect(resume = false): void {
		this.ws?.close()

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
		this.monitor.resetUptime()
		this.ws?.close()
		this.ws = null
	}

	protected createWebSocket(url: string): WebSocket {
		if (!url) {
			throw new Error("Gateway URL is required")
		}
		return new WebSocket(url)
	}

	protected setupWebSocket(): void {
		if (!this.ws) return

		let closed = false

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
						reconnectCallback: () => {
							if (closed) {
								throw new Error(
									"Attempted to reconnect zombie connect after disconnecting first (this shouldn't be possible)"
								)
							}
							closed = true
							this.handleZombieConnection()
						}
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
					if (!Object.values(ListenerEvent).includes(t1)) {
						throw new Error(`Unknown event type: ${t1}`)
					}
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
						closed = true
						if (canResume && this.canResume()) {
							this.connect(true)
						} else {
							this.state.sessionId = null
							this.state.resumeGatewayUrl = null
							this.state.sequence = null
							this.sequence = null
							this.connect(false)
						}
					}, 5000)
					break
				}

				case GatewayOpcodes.Reconnect:
					if (closed) {
						throw new Error(
							"Attempted to reconnect gateway after disconnecting first (this shouldn't be possible)"
						)
					}
					closed = true
					this.state.sequence = this.sequence
					console.log("[setupWebSocket SEQUENCE] sequene:", this.state.sequence)
					this.ws?.close(3024)
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

			if (closed) return
			closed = true

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

		this.disconnect()

		if (this.reconnectAttempts >= maxAttempts) {
			this.emitter.emit(
				"error",
				new Error(
					`Max reconnect attempts (${maxAttempts}) reached${options.code ? ` after code ${options.code}` : ""}`
				)
			)
			this.monitor.destroy()
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
					this.monitor.destroy()
					return
				}

				case GatewayCloseCodes.InvalidSeq:
				case GatewayCloseCodes.SessionTimedOut: {
					this.state.sessionId = null
					this.state.resumeGatewayUrl = null
					this.state.sequence = null
					this.sequence = null
					options.forceNoResume = true
					break
				}
			}
		}

		const backoffTime = Math.min(
			baseDelay * 2 ** this.reconnectAttempts,
			maxDelay
		)
		this.reconnectAttempts++

		if (options.isZombieConnection) {
			this.monitor.recordZombieConnection()
		}

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
		if (!this.client || !this.state.sessionId || this.state.sequence === null)
			return
		const payload = createResumePayload({
			token: this.client.options.token,
			sessionId: this.state.sessionId,
			sequence: this.state.sequence
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
