import {
	GatewayCloseCodes as DiscordGatewayCloseCodes,
	GatewayOpcodes as DiscordGatewayOpcodes,
	GatewayIntents,
	type GatewayReadyDispatchData
} from "discord-api-types/v10"

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

export const GatewayOpcodes = DiscordGatewayOpcodes
export const GatewayCloseCodes = DiscordGatewayCloseCodes

export interface GatewayPayload {
	op: (typeof GatewayOpcodes)[keyof typeof GatewayOpcodes]
	d?: unknown
	s?: number | null
	t?: string | null
}

export type ReadyEventData = GatewayReadyDispatchData

export const GatewayIntents = GatewayIntents
