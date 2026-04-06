import {
	type APIGatewayBotInfo,
	GatewayCloseCodes as DiscordGatewayCloseCodes,
	GatewayOpcodes as DiscordGatewayOpcodes,
	GatewayIntentBits,
	type GatewayReadyDispatchData
} from "discord-api-types/v10"
import { ListenerEvent, type ListenerEventType } from "../../types/listeners.js"

export type GatewayWebSocketLike = {
	readyState: number
	send(data: string): void
	close(code?: number, reason?: string): void
	terminate?: () => void
	on?: (
		event: "open" | "message" | "close" | "error",
		listener: (...args: unknown[]) => void
	) => void
	addEventListener?: (
		event: "open" | "message" | "close" | "error",
		listener: (event: unknown) => void
	) => void
}

export interface GatewayPluginOptions {
	/**
	 * The intents to use for the client
	 */
	intents: number
	/**
	 * The URL of the gateway to connect to
	 */
	url?: string
	/**
	 * The shard to connect to
	 * [shard_id, num_shards]
	 */
	shard?: [number, number]
	/**
	 * The reconnect options
	 */
	reconnect?: {
		/**
		 * The maximum number of reconnect attempts
		 */
		maxAttempts?: number
		/**
		 * The base delay between reconnect attempts
		 */
		baseDelay?: number
		/**
		 * The maximum delay between reconnect attempts after it scales exponentially
		 */
		maxDelay?: number
	}
	/**
	 * This is a custom function you can provide that will filter events.
	 * If this function is present, the plugin will only process events that return `true`.
	 */
	eventFilter?: (event: ListenerEventType) => boolean
	/**
	 * Whether the plugin should automatically handle interactions via the Gateway through Carbon.
	 * @default false
	 */
	autoInteractions?: boolean
	/**
	 * Optional WebSocket constructor/factory for runtimes without Node's `ws` package.
	 * If omitted, Carbon will use `globalThis.WebSocket`.
	 */
	webSocketFactory?: (url: string) => GatewayWebSocketLike
}

/**
 * Represents the current state of the Gateway connection
 */
export interface GatewayState {
	/** Last sequence number received from Gateway - used for resuming connections */
	sequence: number | null
	/** Current session ID - used for resuming connections */
	sessionId: string | null
	/** URL for resuming the Gateway connection if disconnected */
	resumeGatewayUrl: string | null
}

export interface HelloData {
	heartbeat_interval: number
}

export interface ReconnectScheduleOptions {
	code?: number
	reason: "close" | "invalid-session" | "zombie" | "reconnect-opcode"
	preferResume: boolean
	minDelayMs?: number
	allowImmediateFirstAttempt?: boolean
}

export const listenerEvents = new Set(Object.values(ListenerEvent))

export const fatalGatewayCloseCodes = new Set<number>([
	DiscordGatewayCloseCodes.AuthenticationFailed,
	DiscordGatewayCloseCodes.InvalidShard,
	DiscordGatewayCloseCodes.ShardingRequired,
	DiscordGatewayCloseCodes.InvalidAPIVersion,
	DiscordGatewayCloseCodes.InvalidIntents,
	DiscordGatewayCloseCodes.DisallowedIntents
])

export const nonResumableGatewayCloseCodes = new Set<number>([
	DiscordGatewayCloseCodes.InvalidSeq,
	DiscordGatewayCloseCodes.SessionTimedOut,
	DiscordGatewayCloseCodes.NotAuthenticated,
	DiscordGatewayCloseCodes.AlreadyAuthenticated
])

export const reconnectDefaults = {
	baseDelay: 1000,
	maxDelay: 30000,
	maxAttempts: 5
}

export const GatewayOpcodes = DiscordGatewayOpcodes
export const GatewayCloseCodes = DiscordGatewayCloseCodes

export interface GatewayPayload {
	op: (typeof GatewayOpcodes)[keyof typeof GatewayOpcodes]
	d?: unknown
	s?: number | null
	t?: string | null
}

export interface UpdatePresenceData {
	since: number | null
	activities: Activity[]
	status: "online" | "dnd" | "idle" | "invisible" | "offline"
	afk: boolean
}

export interface Activity {
	name: string
	type: number
	url?: string | null
	created_at?: number
	timestamps?: {
		start?: number
		end?: number
	}
	application_id?: string
	details?: string | null
	state?: string | null
	emoji?: {
		name: string
		id?: string
		animated?: boolean
	} | null
	party?: {
		id?: string
		size?: [number, number]
	}
	assets?: {
		large_image?: string
		large_text?: string
		small_image?: string
		small_text?: string
	}
	secrets?: {
		join?: string
		spectate?: string
		match?: string
	}
	instance?: boolean
	flags?: number
	buttons?: string[]
}

export interface UpdateVoiceStateData {
	guild_id: string
	channel_id: string | null
	self_mute: boolean
	self_deaf: boolean
}

export interface RequestGuildMembersData {
	guild_id: string
	/** Query string (empty string "" requests all members). Either query or user_ids is required. */
	query?: string
	limit: number
	presences?: boolean
	/** Specific user IDs to request. Either query or user_ids is required. */
	user_ids?: string | string[]
	nonce?: string
}

export type ReadyEventData = GatewayReadyDispatchData

export const GatewayIntents = GatewayIntentBits

export type { APIGatewayBotInfo }
