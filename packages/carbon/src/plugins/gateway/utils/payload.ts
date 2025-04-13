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
		const payload = JSON.parse(data)
		if (typeof payload.op !== "number") return null
		return payload
	} catch {
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
