import { afterEach, describe, expect, test, vi } from "vitest"
import { GatewayPlugin } from "../../src/plugins/gateway/GatewayPlugin.js"

class MockGlobalWebSocket {
	readyState = 0
	url: string
	binaryType = "blob"

	constructor(url: string) {
		this.url = url
	}

	send() {}
	close() {}
	addEventListener() {}
}

describe("GatewayPlugin websocket selection", () => {
	afterEach(() => {
		vi.unstubAllGlobals()
	})

	test("prefers global WebSocket over ws on Node runtimes", () => {
		vi.stubGlobal("WebSocket", MockGlobalWebSocket)

		const plugin = new GatewayPlugin({ intents: 0 })
		const socket = (
			plugin as unknown as {
				createWebSocket: (url: string) => MockGlobalWebSocket
			}
		).createWebSocket("wss://gateway.discord.gg/?v=10&encoding=json")

		expect(socket).toBeInstanceOf(MockGlobalWebSocket)
		expect(socket.url).toBe("wss://gateway.discord.gg/?v=10&encoding=json")
		expect(socket.binaryType).toBe("arraybuffer")
	})
})
