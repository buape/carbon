import { EventEmitter } from "node:events"
import WebSocket from "ws"
import { Plugin } from "../../abstracts/Plugin.js"
import type { Client } from "../../classes/Client.js"
import {
	GatewayCloseCodes,
	GatewayOpcodes,
	type GatewayPayload,
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

export interface GatewayPluginOptions {
	intents: number
	url?: string
}

declare module "../../classes/Client.js" {
	interface Client {
		emit(event: string, ...args: unknown[]): boolean
	}
}

export class GatewayPlugin extends Plugin {
	protected client?: Client
	protected config: GatewayPluginOptions
	protected state: GatewayState
	protected ws: WebSocket | null = null
	protected monitor: ConnectionMonitor
	public heartbeatInterval?: NodeJS.Timeout
	public sequence: number | null = null
	public lastHeartbeatAck = true
	protected emitter: EventEmitter

	constructor(options: GatewayPluginOptions) {
		super()
		this.config = {
			url: "wss://gateway.discord.gg/?v=10&encoding=json",
			...options
		}
		this.state = {
			sequence: null,
			sessionId: null,
			heartbeatInterval: 0,
			lastHeartbeatAck: true
		}
		this.monitor = new ConnectionMonitor()
		this.emitter = new EventEmitter()

		// Forward monitor events
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
					this.state.heartbeatInterval = helloData.heartbeat_interval
					startHeartbeat(this, {
						interval: helloData.heartbeat_interval,
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
						this.client.emit(t.toLowerCase(), d)
					}
					break
				}

				case GatewayOpcodes.InvalidSession: {
					const canResume = Boolean(d)
					setTimeout(() => {
						if (canResume && this.canResume()) {
							this.connect(true)
						} else {
							// Clear session data and re-identify
							this.state.sessionId = null
							this.state.resumeGatewayUrl = undefined
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
		switch (code) {
			case GatewayCloseCodes.AuthenticationFailed:
			case GatewayCloseCodes.InvalidAPIVersion:
			case GatewayCloseCodes.InvalidIntents:
			case GatewayCloseCodes.DisallowedIntents:
			case GatewayCloseCodes.ShardingRequired:
				// Fatal errors - don't reconnect
				this.emitter.emit("error", new Error(`Fatal Gateway error: ${code}`))
				break

			case GatewayCloseCodes.InvalidSeq:
			case GatewayCloseCodes.SessionTimedOut:
				// Clear session and re-identify
				this.state.sessionId = null
				this.state.resumeGatewayUrl = undefined
				this.sequence = null
				setTimeout(() => this.connect(false), 5000)
				break

			default:
				// Try to resume for other codes
				setTimeout(() => this.connect(this.canResume()), 5000)
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
			}
		})
		this.send(payload)
	}
}
