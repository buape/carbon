import { generateKeyPairSync } from "node:crypto"
import { EventEmitter } from "node:events"
import type { APIWebhookEvent } from "discord-api-types/v10"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"
import {
	GatewayOpcodes,
	type GatewayPayload
} from "../../src/plugins/gateway/types.js"
import { GatewayForwarderPlugin } from "../../src/plugins/gateway-forwarder/GatewayForwarderPlugin.js"

const PRIVATE_KEY = generateKeyPairSync("ed25519")
	.privateKey.export({
		format: "pem",
		type: "pkcs8"
	})
	.toString()

class MockWebSocket extends EventEmitter {
	readyState = 1
	send = vi.fn()
	close = vi.fn()
}

function createPlugin(
	options: Partial<ConstructorParameters<typeof GatewayForwarderPlugin>[0]> = {}
) {
	const plugin = new GatewayForwarderPlugin({
		intents: 1,
		webhookUrl: "https://example.com/events",
		privateKey: PRIVATE_KEY,
		...options
	})
	const ws = new MockWebSocket()
	;(plugin as { ws: MockWebSocket | null }).ws = ws
	;(plugin as { setupWebSocket: () => void }).setupWebSocket()
	return { ws }
}

function emitPayload(ws: MockWebSocket, payload: GatewayPayload) {
	ws.emit("message", Buffer.from(JSON.stringify(payload)))
}

function getForwardedEvents(fetchMock: ReturnType<typeof vi.fn>) {
	return fetchMock.mock.calls.map(([, init]) => {
		const request = init as RequestInit
		return JSON.parse(request.body as string) as APIWebhookEvent
	})
}

async function flushForwarding() {
	await new Promise((resolve) => setTimeout(resolve, 0))
}

describe("GatewayForwarderPlugin guild availability forwarding", () => {
	let fetchMock: ReturnType<typeof vi.fn>

	beforeEach(() => {
		fetchMock = vi.fn().mockResolvedValue({
			ok: true,
			status: 200,
			statusText: "OK",
			text: vi.fn().mockResolvedValue("")
		})
		vi.stubGlobal("fetch", fetchMock)
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	test("forwards startup guild create as GUILD_AVAILABLE", async () => {
		const { ws } = createPlugin()
		emitPayload(ws, {
			op: GatewayOpcodes.Dispatch,
			t: "READY",
			d: {
				session_id: "session",
				resume_gateway_url: "wss://gateway.discord.gg",
				guilds: [{ id: "1" }]
			}
		})
		const guildCreate = { id: "1", unavailable: false }
		emitPayload(ws, {
			op: GatewayOpcodes.Dispatch,
			t: "GUILD_CREATE",
			d: guildCreate
		})

		await flushForwarding()

		const events = getForwardedEvents(fetchMock)
		expect(events.map((event) => event.event.type)).toEqual([
			"READY",
			"GUILD_AVAILABLE"
		])
		expect(events[1]?.event.data).toEqual(guildCreate)
	})

	test("forwards true new guild join as GUILD_CREATE", async () => {
		const { ws } = createPlugin()
		const guildCreate = { id: "2", unavailable: false }
		emitPayload(ws, {
			op: GatewayOpcodes.Dispatch,
			t: "GUILD_CREATE",
			d: guildCreate
		})

		await flushForwarding()

		const events = getForwardedEvents(fetchMock)
		expect(events.map((event) => event.event.type)).toEqual(["GUILD_CREATE"])
		expect(events[0]?.event.data).toEqual(guildCreate)
	})

	test("forwards unavailable guild delete as GUILD_UNAVAILABLE", async () => {
		const { ws } = createPlugin()
		const guildDelete = { id: "3", unavailable: true }
		emitPayload(ws, {
			op: GatewayOpcodes.Dispatch,
			t: "GUILD_DELETE",
			d: guildDelete
		})

		await flushForwarding()

		const events = getForwardedEvents(fetchMock)
		expect(events.map((event) => event.event.type)).toEqual([
			"GUILD_UNAVAILABLE"
		])
		expect(events[0]?.event.data).toEqual(guildDelete)
	})

	test("clears stale availability state when a new READY arrives", async () => {
		const { ws } = createPlugin()
		emitPayload(ws, {
			op: GatewayOpcodes.Dispatch,
			t: "READY",
			d: {
				session_id: "session-1",
				resume_gateway_url: "wss://gateway.discord.gg",
				guilds: [{ id: "4" }]
			}
		})
		emitPayload(ws, {
			op: GatewayOpcodes.Dispatch,
			t: "READY",
			d: {
				session_id: "session-2",
				resume_gateway_url: "wss://gateway.discord.gg",
				guilds: []
			}
		})
		const guildCreate = { id: "4", unavailable: false }
		emitPayload(ws, {
			op: GatewayOpcodes.Dispatch,
			t: "GUILD_CREATE",
			d: guildCreate
		})

		await flushForwarding()

		const events = getForwardedEvents(fetchMock)
		expect(events.map((event) => event.event.type)).toEqual([
			"READY",
			"READY",
			"GUILD_CREATE"
		])
		expect(events[2]?.event.data).toEqual(guildCreate)
	})
})
