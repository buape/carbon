import { describe, expect, test, vi } from "vitest"
import type { Client } from "../../src/classes/Client.js"
import { VoicePlugin } from "../../src/plugins/voice/VoicePlugin.js"
import { VoiceServerUpdate } from "../../src/plugins/voice/VoiceServerUpdateListener.js"
import { VoiceStateUpdate } from "../../src/plugins/voice/VoiceStateUpdateListener.js"

describe("VoicePlugin", () => {
	test("registers voice event listeners on client registration", async () => {
		const voicePlugin = new VoicePlugin()

		const listeners: unknown[] = []
		const mockClient = {
			listeners,
			registerListener: vi.fn((listener: unknown) => {
				listeners.push(listener)
			}),
			getPlugin: vi.fn((id: string) => {
				if (id === "gateway") {
					return { send: vi.fn() }
				}
				if (id === "voice") {
					return voicePlugin
				}
				return undefined
			})
		} as unknown as Client

		await voicePlugin.registerClient(mockClient)

		// Should register 3 listeners: GuildDelete, VoiceStateUpdate, VoiceServerUpdate
		expect(mockClient.listeners).toHaveLength(3)

		const listenerTypes = mockClient.listeners.map((l) => l.type)
		expect(listenerTypes).toContain("GUILD_DELETE")
		expect(listenerTypes).toContain("VOICE_STATE_UPDATE")
		expect(listenerTypes).toContain("VOICE_SERVER_UPDATE")
	})

	test("getGatewayAdapterCreator stores adapter methods", () => {
		const voicePlugin = new VoicePlugin()

		const mockGateway = { send: vi.fn() }

		// Manually set up the plugin (bypass registerClient for this test)
		;(voicePlugin as unknown as { gatewayPlugin: unknown }).gatewayPlugin =
			mockGateway

		const adapterCreator = voicePlugin.getGatewayAdapterCreator("guild123")

		const mockMethods = {
			onVoiceStateUpdate: vi.fn(),
			onVoiceServerUpdate: vi.fn(),
			destroy: vi.fn()
		}

		const adapter = adapterCreator(mockMethods)

		// Adapter methods should be stored
		expect(voicePlugin.adapters.get("guild123")).toBe(mockMethods)

		// Adapter should have sendPayload and destroy
		expect(adapter.sendPayload).toBeDefined()
		expect(adapter.destroy).toBeDefined()

		// Calling destroy should remove from adapters map
		adapter.destroy()
		expect(voicePlugin.adapters.get("guild123")).toBeUndefined()
	})
})

describe("VoiceStateUpdateListener", () => {
	test("forwards VOICE_STATE_UPDATE to adapter", async () => {
		const listener = new VoiceStateUpdate()

		const mockOnVoiceStateUpdate = vi.fn()
		const mockVoicePlugin = {
			adapters: new Map([
				["guild123", { onVoiceStateUpdate: mockOnVoiceStateUpdate }]
			])
		}

		const mockClient = {
			getPlugin: vi.fn((id: string) => {
				if (id === "voice") return mockVoicePlugin
				return undefined
			})
		} as unknown as Client

		const eventData = {
			guild_id: "guild123",
			channel_id: "channel456",
			user_id: "user789",
			session_id: "session123",
			rawMember: undefined
		}

		await listener.handle(eventData as never, mockClient)

		expect(mockOnVoiceStateUpdate).toHaveBeenCalled()
	})

	test("does nothing if no adapter for guild", async () => {
		const listener = new VoiceStateUpdate()

		const mockVoicePlugin = {
			adapters: new Map()
		}

		const mockClient = {
			getPlugin: vi.fn((id: string) => {
				if (id === "voice") return mockVoicePlugin
				return undefined
			})
		} as unknown as Client

		const eventData = {
			guild_id: "unknownGuild",
			channel_id: "channel456"
		}

		// Should not throw
		await listener.handle(eventData as never, mockClient)
	})
})

describe("VoiceServerUpdateListener", () => {
	test("forwards VOICE_SERVER_UPDATE to adapter", async () => {
		const listener = new VoiceServerUpdate()

		const mockOnVoiceServerUpdate = vi.fn()
		const mockVoicePlugin = {
			adapters: new Map([
				["guild123", { onVoiceServerUpdate: mockOnVoiceServerUpdate }]
			])
		}

		const mockClient = {
			getPlugin: vi.fn((id: string) => {
				if (id === "voice") return mockVoicePlugin
				return undefined
			})
		} as unknown as Client

		const eventData = {
			guild_id: "guild123",
			token: "voiceToken123",
			endpoint: "voice.discord.gg"
		}

		await listener.handle(eventData as never, mockClient)

		expect(mockOnVoiceServerUpdate).toHaveBeenCalledWith(eventData)
	})

	test("does nothing if no adapter for guild", async () => {
		const listener = new VoiceServerUpdate()

		const mockVoicePlugin = {
			adapters: new Map()
		}

		const mockClient = {
			getPlugin: vi.fn((id: string) => {
				if (id === "voice") return mockVoicePlugin
				return undefined
			})
		} as unknown as Client

		const eventData = {
			guild_id: "unknownGuild",
			token: "voiceToken123"
		}

		// Should not throw
		await listener.handle(eventData as never, mockClient)
	})
})
