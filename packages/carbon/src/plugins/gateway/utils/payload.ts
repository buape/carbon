import { GatewayOpcodes, type GatewayPayload } from "../types.js"

interface IdentifyProperties {
	os: string
	browser: string
	device: string
}

interface IdentifyData {
	token: string
	properties: IdentifyProperties
	intents: number
}

interface ResumeData {
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
			intents: data.intents
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
