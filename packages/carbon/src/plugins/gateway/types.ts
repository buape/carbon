import {
	GatewayCloseCodes as DiscordGatewayCloseCodes,
	GatewayOpcodes as DiscordGatewayOpcodes,
	type GatewayReadyDispatchData
} from "discord-api-types/v10"
import type { Client } from "../../classes/Client.js"

export interface GatewayConfig {
	client: Client
	intents: number
	url?: string
}

export interface GatewayState {
	sequence: number | null
	sessionId: string | null
	heartbeatInterval: number
	lastHeartbeatAck: boolean
	resumeGatewayUrl?: string
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
