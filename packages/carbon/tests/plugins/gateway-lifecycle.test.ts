import { EventEmitter } from "node:events"
import { describe, expect, test, vi } from "vitest"
import { GatewayPlugin } from "../../src/plugins/gateway/GatewayPlugin.js"
import {
	GatewayOpcodes,
	type GatewayPayload
} from "../../src/plugins/gateway/types.js"

class MockWebSocket extends EventEmitter {
	readyState = 1
	send = vi.fn()
	close = vi.fn()
}

class TestGatewayPlugin extends GatewayPlugin {
	getLifecycleState() {
		return this.connectionState
	}
}

function createPlugin() {
	const sockets: MockWebSocket[] = []
	const plugin = new TestGatewayPlugin(
		{
			intents: 1,
			url: "wss://gateway.example.test",
			webSocketFactory: () => {
				const socket = new MockWebSocket()
				sockets.push(socket)
				return socket
			},
			reconnect: {
				baseDelay: 1,
				maxDelay: 1
			}
		},
		{
			url: "wss://gateway.example.test",
			shards: 1,
			session_start_limit: {
				total: 1000,
				remaining: 1000,
				reset_after: 0,
				max_concurrency: 1
			}
		}
	)
	return { plugin, sockets }
}

function getSocket(sockets: MockWebSocket[]) {
	const socket = sockets[0]
	if (!socket) {
		throw new Error("Expected a gateway socket to be created")
	}
	return socket
}

function emitPayload(socket: MockWebSocket, payload: GatewayPayload) {
	socket.emit("message", JSON.stringify(payload))
}

describe("GatewayPlugin lifecycle state", () => {
	test("tracks connecting state for a new socket", () => {
		const { plugin, sockets } = createPlugin()

		plugin.connect()

		expect(plugin.isConnected).toBe(false)
		expect(plugin.getLifecycleState()).toMatchObject({
			kind: "connecting",
			generation: 1,
			resume: false,
			socket: sockets[0]
		})
	})

	test("tracks connected state after READY dispatch", () => {
		const { plugin, sockets } = createPlugin()
		plugin.connect()

		emitPayload(getSocket(sockets), {
			op: GatewayOpcodes.Dispatch,
			t: "READY",
			s: 42,
			d: {
				session_id: "session-id",
				resume_gateway_url: "wss://resume.example.test",
				guilds: []
			}
		})

		expect(plugin.isConnected).toBe(true)
		expect(plugin.getLifecycleState()).toMatchObject({
			kind: "connected",
			generation: 1,
			session: {
				resumable: true,
				sequence: 42,
				sessionId: "session-id",
				resumeGatewayUrl: "wss://resume.example.test"
			}
		})
	})

	test("tracks reconnecting state after an invalid resumable session", () => {
		vi.useFakeTimers()
		vi.spyOn(Math, "random").mockReturnValue(0)
		const { plugin, sockets } = createPlugin()
		plugin.connect()
		emitPayload(getSocket(sockets), {
			op: GatewayOpcodes.Dispatch,
			t: "READY",
			s: 42,
			d: {
				session_id: "session-id",
				resume_gateway_url: "wss://resume.example.test",
				guilds: []
			}
		})

		emitPayload(getSocket(sockets), {
			op: GatewayOpcodes.InvalidSession,
			d: true
		})

		expect(plugin.getLifecycleState()).toMatchObject({
			kind: "reconnecting",
			attempt: 1,
			resume: true
		})
		vi.useRealTimers()
	})
})
