import { EventEmitter } from "node:events"
import type { GatewayDispatchPayload } from "discord-api-types/v10"
import WebSocket from "ws"
import { Plugin } from "../../abstracts/Plugin.js"
import type { Client } from "../../classes/Client.js"
import {
	ListenerEvent,
	type ListenerEventRawData,
	type ListenerEventType
} from "../../types/index.js"
import { BabyCache } from "./BabyCache.js"
import { InteractionEventListener } from "./InteractionEventListener.js"
import {
	type APIGatewayBotInfo,
	GatewayCloseCodes,
	GatewayIntents,
	GatewayOpcodes,
	type GatewayPayload,
	type GatewayPluginOptions,
	type GatewayState,
	type ReadyEventData,
	type RequestGuildMembersData,
	type UpdatePresenceData,
	type UpdateVoiceStateData
} from "./types.js"
import { startHeartbeat, stopHeartbeat } from "./utils/heartbeat.js"
import { type ConnectionMetrics, ConnectionMonitor } from "./utils/monitor.js"
import {
	createIdentifyPayload,
	createRequestGuildMembersPayload,
	createResumePayload,
	createUpdatePresencePayload,
	createUpdateVoiceStatePayload,
	validatePayload
} from "./utils/payload.js"
import { GatewayRateLimit } from "./utils/rateLimit.js"

interface HelloData {
	heartbeat_interval: number
}

export class GatewayPlugin extends Plugin {
	readonly id = "gateway"
	protected client?: Client
	readonly options: GatewayPluginOptions
	protected state: GatewayState
	protected ws: WebSocket | null = null
	protected monitor: ConnectionMonitor
	protected rateLimit: GatewayRateLimit
	public heartbeatInterval?: NodeJS.Timeout
	public sequence: number | null = null
	public lastHeartbeatAck = true
	protected emitter: EventEmitter
	private reconnectAttempts = 0
	public shardId?: number
	public totalShards?: number
	protected gatewayInfo?: APIGatewayBotInfo
	public isConnected = false
	protected pings: number[] = []
	protected babyCache: BabyCache
	private reconnectTimeout?: NodeJS.Timeout
	private isConnecting = false

	constructor(options: GatewayPluginOptions, gatewayInfo?: APIGatewayBotInfo) {
		super()
		this.options = {
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
		this.rateLimit = new GatewayRateLimit()
		this.emitter = new EventEmitter()
		this.gatewayInfo = gatewayInfo
		this.babyCache = new BabyCache()

		this.monitor.on("metrics", (metrics: ConnectionMetrics) =>
			this.emitter.emit("metrics", metrics)
		)
		this.monitor.on("warning", (warning: string) =>
			this.emitter.emit("warning", warning)
		)
	}

	get ping() {
		return this.pings.length
			? this.pings.reduce((a, b) => a + b, 0) / this.pings.length
			: null
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
		if (this.options.shard) {
			client.shardId = this.options.shard[0]
			client.totalShards = this.options.shard[1]
		}

		if (this.options.autoInteractions) {
			this.client?.registerListener(new InteractionEventListener())
		}

		this.connect()
	}

	public connect(resume = false): void {
		if (this.isConnecting) return
		if (this.reconnectTimeout) {
			clearTimeout(this.reconnectTimeout)
			this.reconnectTimeout = undefined
		}

		this.ws?.close()

		const baseUrl =
			resume && this.state.resumeGatewayUrl
				? this.state.resumeGatewayUrl
				: (this.gatewayInfo?.url ??
					this.options.url ??
					"wss://gateway.discord.gg/")
		const url = this.ensureGatewayParams(baseUrl)
		this.ws = this.createWebSocket(url)
		this.isConnecting = true
		this.setupWebSocket()
	}

	public disconnect(): void {
		stopHeartbeat(this)
		this.lastHeartbeatAck = true
		this.monitor.resetUptime()
		this.ws?.close()
		this.ws = null
		if (this.reconnectTimeout) {
			clearTimeout(this.reconnectTimeout)
			this.reconnectTimeout = undefined
		}
		this.isConnecting = false
		this.isConnected = false
		this.pings = []
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
			this.isConnecting = false
			// Note: reconnectAttempts is reset on READY/RESUMED instead of here,
			// so that exponential backoff keeps increasing when the socket opens
			// but Discord closes it before completing the handshake.
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

			if (s !== null && s !== undefined) {
				this.sequence = s
				this.state.sequence = s
			}

			switch (op) {
				case GatewayOpcodes.Hello: {
					const helloData = d as HelloData
					const interval = helloData.heartbeat_interval
					startHeartbeat(this, {
						interval,
						reconnectCallback: () => {
							if (closed) {
								return
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

				case GatewayOpcodes.HeartbeatAck: {
					this.lastHeartbeatAck = true
					this.monitor.recordHeartbeatAck()
					// Record the latency for ping averaging
					const latency = this.monitor.getMetrics().latency
					if (latency > 0) {
						this.pings.push(latency)
						// Keep only the last 10 pings to prevent unbounded growth
						if (this.pings.length > 10) {
							this.pings.shift()
						}
					}
					break
				}

				case GatewayOpcodes.Heartbeat: {
					this.lastHeartbeatAck = false
					this.send({
						op: GatewayOpcodes.Heartbeat,
						d: this.sequence
					})
					break
				}

				case GatewayOpcodes.Dispatch: {
					const payload1 = payload as GatewayDispatchPayload
					const t1 = payload1.t as ListenerEventType
					try {
						if (!Object.values(ListenerEvent).includes(t1)) {
							break
						}
						if (t1 === "READY") {
							const readyData = d as ReadyEventData
							this.state.sessionId = readyData.session_id
							this.state.resumeGatewayUrl = readyData.resume_gateway_url
						}
						if (t1 === "READY" || t1 === "RESUMED") {
							this.isConnected = true
							this.reconnectAttempts = 0
						}
						if (t && this.client) {
							if (!this.options.eventFilter || this.options.eventFilter?.(t1)) {
								if (t1 === "READY") {
									const readyData = d as ListenerEventRawData[typeof t1]
									readyData.guilds.forEach((guild) => {
										this.babyCache.setGuild(guild.id, {
											available: false,
											lastEvent: Date.now()
										})
									})
								}
								if (t1 === "GUILD_CREATE") {
									const guildCreateData = d as ListenerEventRawData[typeof t1]
									const existingGuild = this.babyCache.getGuild(
										guildCreateData.id
									)
									if (existingGuild && !existingGuild.available) {
										this.babyCache.setGuild(guildCreateData.id, {
											available: true,
											lastEvent: Date.now()
										})
										this.client.eventHandler.handleEvent(
											{
												...guildCreateData,
												clientId: this.client.options.clientId
											},
											"GUILD_AVAILABLE"
										)
										break
									}
								}
								if (t1 === "GUILD_DELETE") {
									const guildDeleteData = d as ListenerEventRawData[typeof t1]
									const existingGuild = this.babyCache.getGuild(
										guildDeleteData.id
									)
									if (existingGuild?.available && guildDeleteData.unavailable) {
										this.babyCache.setGuild(guildDeleteData.id, {
											available: false,
											lastEvent: Date.now()
										})
										this.client.eventHandler.handleEvent(
											{
												...guildDeleteData,
												clientId: this.client.options.clientId
											},
											"GUILD_UNAVAILABLE"
										)
										break
									}
								}
								this.client.eventHandler.handleEvent(
									{ ...payload1.d, clientId: this.client.options.clientId },
									t1
								)
							}
						}
					} catch (err) {
						console.error(err)
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
							this.pings = []
							this.connect(false)
						}
					}, 5000)
					break
				}

				case GatewayOpcodes.Reconnect:
					if (closed) {
						return
					}
					closed = true
					this.state.sequence = this.sequence
					this.ws?.close()
					this.handleReconnect()
					break
			}
		})

		this.ws.on("close", (code: number, _reason: Buffer) => {
			this.isConnecting = false
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
			this.isConnecting = false
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
		} = this.options.reconnect ?? {}

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
					this.pings = []
					options.forceNoResume = true
					break
				}
			}
		}

		if (this.reconnectTimeout || this.isConnecting) {
			return
		}

		this.disconnect()

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

		this.reconnectTimeout = setTimeout(() => {
			this.reconnectTimeout = undefined
			this.connect(shouldResume)
		}, backoffTime)
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
		return Boolean(this.state.sessionId && this.sequence !== null)
	}

	protected resume(): void {
		if (!this.client || !this.state.sessionId || this.sequence === null) return
		const payload = createResumePayload({
			token: this.client.options.token,
			sessionId: this.state.sessionId,
			sequence: this.sequence
		})
		this.send(payload, true)
	}

	public send(payload: GatewayPayload, skipRateLimit = false): void {
		if (this.ws && this.ws.readyState === 1) {
			// Skip rate limiting for essential connection events
			const isEssentialEvent =
				payload.op === GatewayOpcodes.Heartbeat ||
				payload.op === GatewayOpcodes.Identify ||
				payload.op === GatewayOpcodes.Resume

			if (!skipRateLimit && !isEssentialEvent && !this.rateLimit.canSend()) {
				throw new Error(
					`Gateway rate limit exceeded. ${this.rateLimit.getRemainingEvents()} events remaining. Reset in ${this.rateLimit.getResetTime()}ms`
				)
			}

			this.ws.send(JSON.stringify(payload))
			this.monitor.recordMessageSent()

			if (!isEssentialEvent) {
				this.rateLimit.recordEvent()
			}

			if (payload.op === GatewayOpcodes.Heartbeat) {
				this.monitor.recordHeartbeat()
			}
		}
	}

	protected identify(): void {
		if (!this.client) return
		const payload = createIdentifyPayload({
			token: this.client.options.token,
			intents: this.options.intents,
			properties: {
				os: process.platform,
				browser: "@buape/carbon - https://carbon.buape.com",
				device: "@buape/carbon - https://carbon.buape.com"
			},
			...(this.options.shard ? { shard: this.options.shard } : {})
		})
		this.send(payload, true)
	}

	/**
	 * Update the bot's presence (status, activity, etc.)
	 * @param data Presence data to update
	 */
	public updatePresence(data: UpdatePresenceData): void {
		if (!this.isConnected) {
			throw new Error("Gateway is not connected")
		}
		const payload = createUpdatePresencePayload(data)
		this.send(payload)
	}

	/**
	 * Update the bot's voice state
	 * @param data Voice state data to update
	 */
	public updateVoiceState(data: UpdateVoiceStateData): void {
		if (!this.isConnected) {
			throw new Error("Gateway is not connected")
		}

		const payload = createUpdateVoiceStatePayload(data)
		this.send(payload)
	}

	/**
	 * Request guild members from Discord. The data will come in through the GUILD_MEMBERS_CHUNK event, not as a return on this function.
	 * @param data Guild members request data
	 */
	public requestGuildMembers(data: RequestGuildMembersData): void {
		if (!this.isConnected) {
			throw new Error("Gateway is not connected")
		}

		const hasGuildMembersIntent =
			(this.options.intents & GatewayIntents.GuildMembers) !== 0
		if (!hasGuildMembersIntent) {
			throw new Error(
				"GUILD_MEMBERS intent is required for requestGuildMembers operation"
			)
		}

		if (data.presences) {
			const hasPresencesIntent =
				(this.options.intents & GatewayIntents.GuildPresences) !== 0
			if (!hasPresencesIntent) {
				throw new Error(
					"GUILD_PRESENCES intent is required when requesting presences"
				)
			}
		}

		if (!data.query && data.query !== "" && !data.user_ids) {
			throw new Error(
				"Either 'query' or 'user_ids' field is required for requestGuildMembers"
			)
		}

		const payload = createRequestGuildMembersPayload(data)
		this.send(payload)
	}

	/**
	 * Get the current rate limit status
	 */
	public getRateLimitStatus() {
		return {
			remainingEvents: this.rateLimit.getRemainingEvents(),
			resetTime: this.rateLimit.getResetTime(),
			currentEventCount: this.rateLimit.getCurrentEventCount()
		}
	}

	/**
	 * Get information about optionsured intents
	 */
	public getIntentsInfo() {
		return {
			intents: this.options.intents,
			hasGuilds: (this.options.intents & GatewayIntents.Guilds) !== 0,
			hasGuildMembers:
				(this.options.intents & GatewayIntents.GuildMembers) !== 0,
			hasGuildPresences:
				(this.options.intents & GatewayIntents.GuildPresences) !== 0,
			hasGuildMessages:
				(this.options.intents & GatewayIntents.GuildMessages) !== 0,
			hasMessageContent:
				(this.options.intents & GatewayIntents.MessageContent) !== 0
		}
	}

	/**
	 * Check if a specific intent is enabled
	 * @param intent The intent to check
	 */
	public hasIntent(intent: number): boolean {
		return (this.options.intents & intent) !== 0
	}

	private ensureGatewayParams(url: string): string {
		try {
			const parsed = new URL(url)
			if (!parsed.searchParams.get("v")) {
				parsed.searchParams.set("v", "10")
			}
			if (!parsed.searchParams.get("encoding")) {
				parsed.searchParams.set("encoding", "json")
			}
			return parsed.toString()
		} catch {
			const hasQuery = url.includes("?")
			const hasV = url.includes("v=")
			const hasEncoding = url.includes("encoding=")
			const separator = hasQuery ? "&" : "?"
			const parts: string[] = []
			if (!hasV) parts.push("v=10")
			if (!hasEncoding) parts.push("encoding=json")
			return parts.length ? `${url}${separator}${parts.join("&")}` : url
		}
	}
}
