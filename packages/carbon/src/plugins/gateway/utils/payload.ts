import {
	GatewayOpcodes,
	type GatewayPayload,
	type RequestGuildMembersData,
	type UpdatePresenceData,
	type UpdateVoiceStateData
} from "../types.js"

export interface IdentifyProperties {
	os: string
	browser: string
	device: string
}

export interface IdentifyData {
	token: string
	properties: IdentifyProperties
	intents: number
	shard?: [number, number]
}

export interface ResumeData {
	token: string
	sessionId: string
	sequence: number
}

export function validatePayload(data: string): GatewayPayload | null {
	try {
		const payload = JSON.parse(data) as GatewayPayload

		if (!payload || typeof payload !== "object") {
			console.error("[Gateway] Invalid payload: Not an object", { data })
			return null
		}

		if (!("op" in payload) || typeof payload.op !== "number") {
			console.error("[Gateway] Invalid payload: Missing or invalid op code", {
				data
			})
			return null
		}

		if (!("d" in payload)) {
			console.error("[Gateway] Invalid payload: Missing data field", { data })
			return null
		}

		return payload
	} catch (error) {
		console.error("[Gateway] Failed to validate payload:", error, { data })
		return null
	}
}

export function createIdentifyPayload(data: IdentifyData): GatewayPayload {
	return {
		op: GatewayOpcodes.Identify,
		d: {
			token: data.token,
			properties: data.properties,
			intents: data.intents,
			...(data.shard ? { shard: data.shard } : {})
		}
	}
}

export function createResumePayload(data: ResumeData): GatewayPayload {
	return {
		op: GatewayOpcodes.Resume,
		d: {
			token: data.token,
			session_id: data.sessionId,
			seq: data.sequence
		}
	}
}

export function createUpdatePresencePayload(
	data: UpdatePresenceData
): GatewayPayload {
	return {
		op: GatewayOpcodes.PresenceUpdate,
		d: data
	}
}

export function createUpdateVoiceStatePayload(
	data: UpdateVoiceStateData
): GatewayPayload {
	return {
		op: GatewayOpcodes.VoiceStateUpdate,
		d: data
	}
}

export function createRequestGuildMembersPayload(
	data: RequestGuildMembersData
): GatewayPayload {
	return {
		op: GatewayOpcodes.RequestGuildMembers,
		d: data
	}
}
