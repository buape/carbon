import { EventEmitter } from "node:events"
import { afterEach, expect, test, vi } from "vitest"
import type WebSocket from "ws"
import { GatewayPlugin } from "../src/plugins/gateway/GatewayPlugin.js"
import { GatewayIntents, GatewayOpcodes } from "../src/plugins/gateway/types.js"

class MockWebSocket extends EventEmitter {
	readyState = 1

	send(): void {}

	close(): void {
		this.readyState = 3
		this.emit("close", 1005, Buffer.alloc(0))
	}
}

class TestGatewayPlugin extends GatewayPlugin {
	public sockets: MockWebSocket[] = []

	protected createWebSocket(_url: string): WebSocket {
		const socket = new MockWebSocket()
		this.sockets.push(socket)
		return socket as unknown as WebSocket
	}
}

afterEach(() => {
	vi.useRealTimers()
})

test("disconnect does not emit reconnect exhaustion for intentional close", () => {
	const plugin = new TestGatewayPlugin({
		intents: GatewayIntents.Guilds,
		url: "wss://gateway.discord.gg",
		reconnect: { maxAttempts: 0 }
	})
	const errorListener = vi.fn()
	;(plugin as GatewayPlugin & { emitter: EventEmitter }).emitter.on(
		"error",
		errorListener
	)

	plugin.connect()
	plugin.disconnect()

	expect(errorListener).not.toHaveBeenCalled()
})

test("unexpected close still emits reconnect exhaustion when retries are disabled", () => {
	const plugin = new TestGatewayPlugin({
		intents: GatewayIntents.Guilds,
		url: "wss://gateway.discord.gg",
		reconnect: { maxAttempts: 0 }
	})
	const errorListener = vi.fn()
	;(plugin as GatewayPlugin & { emitter: EventEmitter }).emitter.on(
		"error",
		errorListener
	)

	plugin.connect()
	const socket = plugin.sockets[0]
	if (!socket) {
		throw new Error("Expected initial socket")
	}

	socket.emit("close", 1005, Buffer.alloc(0))

	expect(errorListener).toHaveBeenCalledWith(
		new Error("Max reconnect attempts (0) reached after code 1005")
	)
})

test("does not reconnect twice when Invalid Session is followed by close", () => {
	vi.useFakeTimers()

	const plugin = new TestGatewayPlugin({
		intents: GatewayIntents.Guilds,
		url: "wss://gateway.discord.gg"
	})

	plugin.connect()
	const socket = plugin.sockets[0]
	if (!socket) {
		throw new Error("Expected initial socket")
	}

	socket.emit(
		"message",
		JSON.stringify({
			op: GatewayOpcodes.InvalidSession,
			d: false
		})
	)
	socket.emit("close", 1000, Buffer.alloc(0))

	expect(plugin.sockets).toHaveLength(1)

	vi.advanceTimersByTime(1_000)
	expect(plugin.sockets).toHaveLength(2)

	vi.advanceTimersByTime(5_000)
	expect(plugin.sockets).toHaveLength(2)

	plugin.disconnect()
})

test("connect clears existing heartbeat timers before opening a new socket", () => {
	vi.useFakeTimers()

	const plugin = new TestGatewayPlugin({
		intents: GatewayIntents.Guilds,
		url: "wss://gateway.discord.gg"
	})

	const firstHeartbeatTimeout = setTimeout(() => {}, 10_000)
	const heartbeatInterval = setInterval(() => {}, 10_000)

	;(
		plugin as GatewayPlugin & { firstHeartbeatTimeout?: NodeJS.Timeout }
	).firstHeartbeatTimeout = firstHeartbeatTimeout as NodeJS.Timeout
	plugin.heartbeatInterval = heartbeatInterval as NodeJS.Timeout

	plugin.connect()

	expect(
		(plugin as GatewayPlugin & { firstHeartbeatTimeout?: NodeJS.Timeout })
			.firstHeartbeatTimeout
	).toBeUndefined()
	expect(plugin.heartbeatInterval).toBeUndefined()

	plugin.disconnect()
})
