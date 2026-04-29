import { EventEmitter } from "node:events"
import { createRequire } from "node:module"
import type { GatewayDispatchPayload } from "discord-api-types/v10"
import { Plugin } from "../../abstracts/Plugin.js"
import type { Client } from "../../classes/Client.js"
import type {
	ListenerEventRawData,
	ListenerEventType
} from "../../types/index.js"
import { BabyCache } from "./BabyCache.js"
import { InteractionEventListener } from "./InteractionEventListener.js"
import {
	type APIGatewayBotInfo,
	fatalGatewayCloseCodes,
	GatewayIntents,
	GatewayOpcodes,
	type GatewayPayload,
	type GatewayPluginOptions,
	type GatewayState,
	type GatewayWebSocketLike,
	type HelloData,
	listenerEvents,
	nonResumableGatewayCloseCodes,
	type ReadyEventData,
	type ReconnectScheduleOptions,
	type RequestGuildMembersData,
	reconnectDefaults,
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

const textDecoder = new TextDecoder()
const socketOpenState = 1
let nodeRequire: NodeJS.Require | null = null

try {
	if (
		typeof process !== "undefined" &&
		process.versions?.node &&
		typeof import.meta.url === "string"
	) {
		nodeRequire = createRequire(import.meta.url)
	}
} catch {
	nodeRequire = null
}

export class GatewayPlugin extends Plugin {
	readonly id = "gateway"
	protected client?: Client
	readonly options: GatewayPluginOptions
	protected state: GatewayState
	protected ws: GatewayWebSocketLike | null = null
	protected monitor: ConnectionMonitor
	protected rateLimit: GatewayRateLimit
	public heartbeatInterval?: NodeJS.Timeout
	public firstHeartbeatTimeout?: NodeJS.Timeout
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
	private socketGeneration = 0
	private shouldReconnect = false
	private nextConnectionShouldResume = false
	private silentSocketClosures = new WeakSet<GatewayWebSocketLike>()
	private consecutiveResumeFailures = 0

	constructor(options: GatewayPluginOptions, gatewayInfo?: APIGatewayBotInfo) {
		super()
		this.options = {
			reconnect: {
				...reconnectDefaults,
				...options.reconnect
			},
			...options,
			intents: options.intents ?? 0
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

	/**
	 * Bootstraps gateway metadata and opens the initial websocket connection.
	 */
	public async registerClient(client: Client): Promise<void> {
		this.client = client

		if (!this.gatewayInfo) {
			let response: Response
			try {
				response = await fetch("https://discord.com/api/v10/gateway/bot", {
					headers: {
						Authorization: `Bot ${client.options.token}`
					}
				})
			} catch (error) {
				throw new Error(
					`Failed to get gateway information from Discord: ${error instanceof Error ? error.message : String(error)}`,
					{ cause: error }
				)
			}
			if (!response.ok) {
				throw new Error(
					`Failed to get gateway information from Discord: ${response.status} ${response.statusText}`
				)
			}
			this.gatewayInfo = (await response.json()) as APIGatewayBotInfo
		}

		if (this.options.shard) {
			client.shardId = this.options.shard[0]
			client.totalShards = this.options.shard[1]
		}

		if (this.options.autoInteractions) {
			this.client.registerListener(new InteractionEventListener())
		}

		this.shouldReconnect = true
		this.connect(false)
	}

	/**
	 * Opens a new websocket connection and prepares either IDENTIFY or RESUME on HELLO.
	 */
	public connect(resume = false): void {
		if (this.isConnecting) {
			return
		}

		this.shouldReconnect = true
		this.clearReconnectTimeout()
		stopHeartbeat(this)
		this.lastHeartbeatAck = true

		const oldSocket = this.ws
		if (oldSocket) {
			this.silentSocketClosures.add(oldSocket)
			this.closeSocketImmediately(oldSocket)
		}

		const baseUrl =
			resume && this.state.resumeGatewayUrl
				? this.state.resumeGatewayUrl
				: (this.gatewayInfo?.url ??
					this.options.url ??
					"wss://gateway.discord.gg/")
		const url = this.ensureGatewayParams(baseUrl)

		this.nextConnectionShouldResume = resume
		this.socketGeneration++
		this.ws = this.createWebSocket(url)
		this.isConnecting = true
		this.isConnected = false
		this.setupWebSocket()
	}

	/**
	 * Stops heartbeats, clears reconnect state, and closes the active socket intentionally.
	 */
	public disconnect(): void {
		this.shouldReconnect = false
		this.clearReconnectTimeout()
		stopHeartbeat(this)
		this.lastHeartbeatAck = true
		this.monitor.resetUptime()
		this.rateLimit.reset()
		if (this.ws) {
			this.silentSocketClosures.add(this.ws)
			this.ws.close(1000, "Client disconnect")
		}
		this.ws = null
		this.isConnecting = false
		this.isConnected = false
		this.reconnectAttempts = 0
		this.consecutiveResumeFailures = 0
		this.pings = []
	}

	/**
	 * Creates the websocket instance for a gateway URL. Override in tests if needed.
	 */
	protected createWebSocket(url: string): GatewayWebSocketLike {
		if (!url) {
			throw new Error("Gateway URL is required")
		}

		const socket = this.options.webSocketFactory
			? this.options.webSocketFactory(url)
			: (() => {
					if (typeof globalThis.WebSocket === "function") {
						return new globalThis.WebSocket(
							url
						) as unknown as GatewayWebSocketLike
					}

					if (nodeRequire) {
						try {
							const wsModule = nodeRequire("ws") as {
								default?: unknown
								WebSocket?: unknown
							}
							const nodeWebSocket =
								typeof wsModule.WebSocket === "function"
									? (wsModule.WebSocket as new (
											url: string
										) => GatewayWebSocketLike)
									: typeof wsModule.default === "function"
										? (wsModule.default as new (
												url: string
											) => GatewayWebSocketLike)
										: null
							if (nodeWebSocket) {
								return new nodeWebSocket(url)
							}
						} catch {
							// fall through when ws is unavailable
						}
					}

					return null
				})()

		if (!socket) {
			throw new Error(
				"No WebSocket implementation available. Provide GatewayPluginOptions.webSocketFactory or install 'ws'."
			)
		}

		if ("binaryType" in socket) {
			try {
				;(socket as { binaryType?: string }).binaryType = "arraybuffer"
			} catch {
				// Ignore runtimes that expose a readonly binaryType.
			}
		}

		return socket
	}

	/**
	 * Attaches websocket lifecycle handlers for open, message, close, and error.
	 */
	protected setupWebSocket(): void {
		if (!this.ws) {
			return
		}

		const socket = this.ws
		const generation = this.socketGeneration

		this.onSocketEvent(socket, "open", () => {
			if (!this.isCurrentSocket(socket, generation)) {
				return
			}
			this.isConnecting = false
			this.emitter.emit("debug", "Gateway websocket opened")
		})

		this.onSocketEvent(socket, "message", (incoming) => {
			if (!this.isCurrentSocket(socket, generation)) {
				return
			}

			this.monitor.recordMessageReceived()
			const payloadText = this.getMessageText(incoming)
			const payload = payloadText ? validatePayload(payloadText) : null
			if (!payload) {
				this.monitor.recordError()
				this.emitter.emit("error", new Error("Invalid gateway payload"))
				return
			}

			if (payload.s !== null && payload.s !== undefined) {
				this.sequence = payload.s
				this.state.sequence = payload.s
			}

			switch (payload.op) {
				case GatewayOpcodes.Hello:
					this.handleHello(payload.d, generation)
					break
				case GatewayOpcodes.HeartbeatAck:
					this.handleHeartbeatAck()
					break
				case GatewayOpcodes.Heartbeat:
					this.sendHeartbeatNow()
					break
				case GatewayOpcodes.Dispatch:
					this.handleDispatch(payload as GatewayDispatchPayload)
					break
				case GatewayOpcodes.InvalidSession:
					this.handleInvalidSession(payload.d)
					break
				case GatewayOpcodes.Reconnect:
					this.handleReconnectOpcode()
					break
			}
		})

		this.onSocketEvent(socket, "close", (incoming) => {
			if (!this.isCurrentSocket(socket, generation)) {
				return
			}

			this.isConnecting = false
			this.isConnected = false
			stopHeartbeat(this)
			this.lastHeartbeatAck = true

			const wasSilentClose = this.silentSocketClosures.has(socket)
			if (wasSilentClose) {
				this.silentSocketClosures.delete(socket)
				return
			}

			const code = this.getCloseCode(incoming)
			this.monitor.recordReconnect()
			this.emitter.emit("debug", `Gateway websocket closed: ${code}`)
			this.handleClose(code)
		})

		this.onSocketEvent(socket, "error", (incoming) => {
			if (!this.isCurrentSocket(socket, generation)) {
				return
			}
			this.isConnecting = false
			this.monitor.recordError()
			this.emitter.emit("error", this.getSocketError(incoming))
		})
	}

	/**
	 * Handles close codes and decides whether reconnection should resume or re-identify.
	 */
	protected handleClose(code: number): void {
		if (!this.shouldReconnect) {
			return
		}

		if (fatalGatewayCloseCodes.has(code)) {
			this.shouldReconnect = false
			this.emitter.emit("error", new Error(`Fatal gateway close code: ${code}`))
			this.disconnect()
			return
		}

		if (nonResumableGatewayCloseCodes.has(code)) {
			this.resetSessionState()
		}

		this.scheduleReconnect({
			code,
			reason: "close",
			preferResume: !nonResumableGatewayCloseCodes.has(code)
		})
	}

	/**
	 * Handles missing heartbeat acknowledgements by forcing a reconnect flow.
	 */
	protected handleZombieConnection(): void {
		this.monitor.recordZombieConnection()
		this.scheduleReconnect({
			reason: "zombie",
			preferResume: true
		})
		this.reconnectWithSocketRestart()
	}

	/**
	 * Compatibility wrapper that maps to reconnect opcode handling.
	 */
	protected handleReconnect(): void {
		this.handleReconnectOpcode()
	}

	/**
	 * Returns whether session_id and sequence are both available for RESUME.
	 */
	protected canResume(): boolean {
		return Boolean(this.state.sessionId && this.sequence !== null)
	}

	/**
	 * Sends a RESUME payload using cached session_id and latest sequence.
	 */
	protected resume(): void {
		if (!this.client || !this.state.sessionId || this.sequence === null) {
			return
		}
		const payload = createResumePayload({
			token: this.client.options.token,
			sessionId: this.state.sessionId,
			sequence: this.sequence
		})
		this.send(payload, true)
	}

	/**
	 * Sends a gateway payload with size and rate-limit safeguards.
	 */
	public send(payload: GatewayPayload, skipRateLimit = false): void {
		if (!this.ws || this.ws.readyState !== socketOpenState) {
			throw new Error("Gateway websocket is not open")
		}

		const isEssentialEvent =
			payload.op === GatewayOpcodes.Heartbeat ||
			payload.op === GatewayOpcodes.Identify ||
			payload.op === GatewayOpcodes.Resume

		if (!skipRateLimit && !isEssentialEvent && !this.rateLimit.canSend()) {
			throw new Error(
				`Gateway rate limit exceeded. ${this.rateLimit.getRemainingEvents()} events remaining. Reset in ${this.rateLimit.getResetTime()}ms`
			)
		}

		const encodedPayload = JSON.stringify(payload)
		const payloadSize =
			typeof Buffer !== "undefined"
				? Buffer.byteLength(encodedPayload, "utf8")
				: new TextEncoder().encode(encodedPayload).byteLength
		if (payloadSize > 4096) {
			throw new Error("Gateway payload exceeds 4096-byte Discord limit")
		}

		this.ws.send(encodedPayload)
		this.monitor.recordMessageSent()

		if (!isEssentialEvent) {
			this.rateLimit.recordEvent()
		}

		if (payload.op === GatewayOpcodes.Heartbeat) {
			this.monitor.recordHeartbeat()
		}
	}

	/**
	 * Sends an IDENTIFY payload for a fresh gateway session.
	 */
	protected identify(): void {
		if (!this.client) {
			return
		}
		const payload = createIdentifyPayload({
			token: this.client.options.token,
			intents: this.options.intents,
			properties: {
				os:
					typeof process !== "undefined" && process?.platform
						? process.platform
						: "unknown",
				browser: "@buape/carbon - https://carbon.buape.com",
				device: "@buape/carbon - https://carbon.buape.com"
			},
			...(this.options.shard ? { shard: this.options.shard } : {})
		})
		this.send(payload, true)
	}

	/**
	 * Updates bot presence over the gateway connection.
	 */
	public updatePresence(data: UpdatePresenceData): void {
		if (!this.isConnected) {
			throw new Error("Gateway is not connected")
		}
		this.send(createUpdatePresencePayload(data))
	}

	/**
	 * Updates bot voice state for a guild over the gateway connection.
	 */
	public updateVoiceState(data: UpdateVoiceStateData): void {
		if (!this.isConnected) {
			throw new Error("Gateway is not connected")
		}
		this.send(createUpdateVoiceStatePayload(data))
	}

	/**
	 * Requests guild members and validates required intents/options.
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

		this.send(createRequestGuildMembersPayload(data))
	}

	/**
	 * Returns the current outbound gateway rate-limit snapshot.
	 */
	public getRateLimitStatus() {
		return {
			remainingEvents: this.rateLimit.getRemainingEvents(),
			resetTime: this.rateLimit.getResetTime(),
			currentEventCount: this.rateLimit.getCurrentEventCount()
		}
	}

	/**
	 * Returns helpers describing which intents are currently enabled.
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
	 * Checks if a specific intent bit is enabled.
	 */
	public hasIntent(intent: number): boolean {
		return (this.options.intents & intent) !== 0
	}

	/**
	 * Guards handlers from acting on stale websocket instances.
	 */
	private isCurrentSocket(
		socket: GatewayWebSocketLike,
		generation: number
	): boolean {
		return this.ws === socket && this.socketGeneration === generation
	}

	protected onSocketEvent(
		socket: GatewayWebSocketLike,
		event: "open" | "message" | "close" | "error",
		handler: (incoming: unknown) => void
	) {
		if (typeof socket.on === "function") {
			socket.on(event, (...args) => {
				if (args.length === 0) {
					handler(undefined)
					return
				}
				handler(args.length === 1 ? args[0] : args)
			})
			return
		}

		if (typeof socket.addEventListener === "function") {
			socket.addEventListener(event, (incoming) => {
				handler(incoming)
			})
			return
		}

		throw new Error("WebSocket implementation does not support event listeners")
	}

	protected getMessageText(incoming: unknown): string | null {
		const payload = this.extractSocketPayload(incoming)
		if (typeof payload === "string") {
			return payload
		}
		if (payload instanceof ArrayBuffer) {
			return textDecoder.decode(new Uint8Array(payload))
		}
		if (ArrayBuffer.isView(payload)) {
			return textDecoder.decode(
				new Uint8Array(payload.buffer, payload.byteOffset, payload.byteLength)
			)
		}
		if (payload && typeof payload === "object" && "toString" in payload) {
			const text = String(payload)
			return text === "[object Object]" ? null : text
		}
		return null
	}

	private extractSocketPayload(incoming: unknown) {
		if (Array.isArray(incoming)) {
			return incoming[0]
		}
		if (incoming && typeof incoming === "object" && "data" in incoming) {
			return (incoming as { data: unknown }).data
		}
		return incoming
	}

	private getCloseCode(incoming: unknown) {
		if (Array.isArray(incoming)) {
			const [code] = incoming
			if (typeof code === "number") {
				return code
			}
		}
		if (incoming && typeof incoming === "object" && "code" in incoming) {
			const code = (incoming as { code?: unknown }).code
			if (typeof code === "number") {
				return code
			}
		}
		return 1000
	}

	private getSocketError(incoming: unknown) {
		const payload = this.extractSocketPayload(incoming)
		if (payload instanceof Error) {
			return payload
		}
		if (payload && typeof payload === "object" && "error" in payload) {
			const nested = (payload as { error?: unknown }).error
			if (nested instanceof Error) {
				return nested
			}
		}
		return new Error(
			typeof payload === "string"
				? payload
				: "Gateway socket emitted an unknown error"
		)
	}

	private closeSocketImmediately(socket: GatewayWebSocketLike) {
		if (typeof socket.terminate === "function") {
			socket.terminate()
			return
		}
		socket.close(1000, "Gateway reconnect")
	}

	/**
	 * Processes HELLO, starts heartbeat scheduling, then sends RESUME or IDENTIFY.
	 */
	private handleHello(data: unknown, generation: number): void {
		const heartbeatInterval = (data as HelloData)?.heartbeat_interval
		if (typeof heartbeatInterval !== "number" || heartbeatInterval <= 0) {
			this.monitor.recordError()
			this.emitter.emit("error", new Error("Gateway HELLO missing heartbeat"))
			this.handleZombieConnection()
			return
		}

		startHeartbeat(this, {
			interval: heartbeatInterval,
			reconnectCallback: () => {
				if (this.socketGeneration !== generation) {
					return
				}
				this.handleZombieConnection()
			}
		})

		const shouldResume = this.nextConnectionShouldResume && this.canResume()
		this.nextConnectionShouldResume = false

		try {
			if (shouldResume) {
				this.resume()
				return
			}

			this.identify()
		} catch {
			this.handleZombieConnection()
		}
	}

	/**
	 * Marks heartbeat acknowledged and updates rolling ping metrics.
	 */
	private handleHeartbeatAck(): void {
		this.lastHeartbeatAck = true
		this.monitor.recordHeartbeatAck()
		const latency = this.monitor.getMetrics().latency
		if (latency > 0) {
			this.pings.push(latency)
			if (this.pings.length > 10) {
				this.pings.shift()
			}
		}
	}

	/**
	 * Immediately sends a heartbeat in response to gateway heartbeat requests.
	 */
	private sendHeartbeatNow(): void {
		this.lastHeartbeatAck = false
		try {
			this.send({
				op: GatewayOpcodes.Heartbeat,
				d: this.sequence
			})
		} catch {
			this.handleZombieConnection()
		}
	}

	/**
	 * Processes dispatch events, session caching, and Carbon event forwarding.
	 */
	private handleDispatch(payload: GatewayDispatchPayload): void {
		const type = payload.t as ListenerEventType
		if (!listenerEvents.has(type)) {
			return
		}

		if (type === "READY") {
			const readyData = payload.d as ReadyEventData
			this.state.sessionId = readyData.session_id
			this.state.resumeGatewayUrl = readyData.resume_gateway_url
		}

		if (type === "READY" || type === "RESUMED") {
			this.isConnected = true
			this.reconnectAttempts = 0
			this.consecutiveResumeFailures = 0
		}

		if (!this.client) {
			return
		}

		if (this.options.eventFilter && !this.options.eventFilter(type)) {
			return
		}

		if (type === "READY") {
			const readyData = payload.d as ListenerEventRawData["READY"]
			readyData.guilds.forEach((guild) => {
				this.babyCache.setGuild(guild.id, {
					available: false,
					lastEvent: Date.now()
				})
			})
		}

		if (type === "GUILD_CREATE") {
			const guildCreateData = payload.d as ListenerEventRawData["GUILD_CREATE"]
			const existingGuild = this.babyCache.getGuild(guildCreateData.id)
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
				return
			}
		}

		if (type === "GUILD_DELETE") {
			const guildDeleteData = payload.d as ListenerEventRawData["GUILD_DELETE"]
			const existingGuild = this.babyCache.getGuild(guildDeleteData.id)
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
				return
			}

			if (!guildDeleteData.unavailable) {
				this.babyCache.removeGuild(guildDeleteData.id)
			}
		}

		this.client.eventHandler.handleEvent(
			{ ...payload.d, clientId: this.client.options.clientId },
			type
		)
	}

	/**
	 * Handles INVALID_SESSION and schedules reconnect with Discord-compliant delay.
	 */
	private handleInvalidSession(data: unknown): void {
		const isResumable = Boolean(data) && this.canResume()
		if (!isResumable) {
			this.resetSessionState()
		}

		const discordRequiredDelay = 1000 + Math.floor(Math.random() * 4000)
		this.scheduleReconnect({
			reason: "invalid-session",
			preferResume: isResumable,
			minDelayMs: discordRequiredDelay
		})
		this.reconnectWithSocketRestart()
	}

	/**
	 * Handles RECONNECT opcode by scheduling reconnect with resume preference.
	 */
	private handleReconnectOpcode(): void {
		this.scheduleReconnect({
			reason: "reconnect-opcode",
			preferResume: true,
			allowImmediateFirstAttempt: true
		})
		this.reconnectWithSocketRestart()
	}

	/**
	 * Terminates the current socket after reconnect has been scheduled.
	 */
	private reconnectWithSocketRestart(): void {
		stopHeartbeat(this)
		this.lastHeartbeatAck = true
		if (!this.ws) {
			return
		}
		this.silentSocketClosures.add(this.ws)
		this.closeSocketImmediately(this.ws)
	}

	/**
	 * Schedules a single reconnect attempt with backoff and attempt limits.
	 */
	private scheduleReconnect(options: ReconnectScheduleOptions): void {
		if (!this.shouldReconnect || this.reconnectTimeout || this.isConnecting) {
			return
		}

		const maxAttempts =
			this.options.reconnect?.maxAttempts ?? reconnectDefaults.maxAttempts
		if (Number.isFinite(maxAttempts) && this.reconnectAttempts >= maxAttempts) {
			this.shouldReconnect = false
			this.emitter.emit(
				"error",
				new Error(
					`Max reconnect attempts (${maxAttempts}) reached${options.code ? ` after close code ${options.code}` : ""}`
				)
			)
			return
		}

		let shouldResume = options.preferResume && this.canResume()
		const resumeFailureThreshold = 3
		if (
			shouldResume &&
			this.consecutiveResumeFailures >= resumeFailureThreshold
		) {
			this.resetSessionState()
			shouldResume = false
			this.emitter.emit(
				"debug",
				`Gateway forcing fresh IDENTIFY after ${resumeFailureThreshold} failed resume attempts`
			)
		}

		const delay = this.computeReconnectDelay(options)
		if (shouldResume) {
			this.consecutiveResumeFailures++
		} else {
			this.consecutiveResumeFailures = 0
		}
		this.reconnectAttempts++

		this.emitter.emit(
			"debug",
			`Gateway reconnect scheduled in ${delay}ms (${options.reason}, resume=${String(shouldResume)})`
		)

		this.reconnectTimeout = setTimeout(() => {
			this.reconnectTimeout = undefined
			this.connect(shouldResume)
		}, delay)
	}

	/**
	 * Computes exponential reconnect delay with jitter and optional minimum delay.
	 */
	private computeReconnectDelay(options: ReconnectScheduleOptions): number {
		const baseDelay =
			this.options.reconnect?.baseDelay ?? reconnectDefaults.baseDelay
		const maxDelay =
			this.options.reconnect?.maxDelay ?? reconnectDefaults.maxDelay

		if (
			options.allowImmediateFirstAttempt &&
			this.reconnectAttempts === 0 &&
			(options.minDelayMs ?? 0) === 0
		) {
			return 0
		}

		const exponentialDelay = Math.min(
			baseDelay * 2 ** this.reconnectAttempts,
			maxDelay
		)
		const jitterFactor = 0.85 + Math.random() * 0.3
		const jitteredDelay = Math.floor(exponentialDelay * jitterFactor)
		return Math.max(options.minDelayMs ?? 0, jitteredDelay)
	}

	/**
	 * Clears any pending reconnect timer.
	 */
	private clearReconnectTimeout(): void {
		if (!this.reconnectTimeout) {
			return
		}
		clearTimeout(this.reconnectTimeout)
		this.reconnectTimeout = undefined
	}

	/**
	 * Clears resume-related session state after non-resumable failures.
	 */
	private resetSessionState(): void {
		this.state.sessionId = null
		this.state.resumeGatewayUrl = null
		this.state.sequence = null
		this.sequence = null
		this.consecutiveResumeFailures = 0
		this.pings = []
	}

	/**
	 * Ensures gateway URLs include v=10 and encoding=json query parameters.
	 */
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
