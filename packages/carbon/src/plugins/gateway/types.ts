import {
	GatewayCloseCodes as DiscordGatewayCloseCodes,
	GatewayOpcodes as DiscordGatewayOpcodes,
	type GatewayReadyDispatchData
} from "discord-api-types/v10"
import type { Client } from "../../classes/Client.js"

/**
 * Configuration interface for the Gateway plugin
 */
export interface GatewayConfig {
	/** The Carbon client instance */
	client: Client
	/** Discord Gateway intents bitfield - controls which events the bot receives */
	intents: number
	/** Optional custom Gateway URL - defaults to Discord's standard Gateway */
	url?: string
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
