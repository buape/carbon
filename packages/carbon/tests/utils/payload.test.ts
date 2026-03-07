import { MessageFlags } from "discord-api-types/v10"
import { describe, expect, test } from "vitest"
import { serializePayload } from "../../src/utils/payload.js"

describe("serializePayload voice messages", () => {
	test("throws when voice message has content", () => {
		expect(() =>
			serializePayload({
				content: "hello world",
				flags: MessageFlags.IsVoiceMessage,
				files: [
					{
						name: "voice.ogg",
						data: new Blob(["audio"]),
						duration_secs: 1.5,
						waveform: "AAAA"
					}
				]
			})
		).toThrow("voice message")
	})

	test("throws when voice message is missing file metadata", () => {
		expect(() =>
			serializePayload({
				flags: MessageFlags.IsVoiceMessage,
				files: [
					{
						name: "voice.ogg",
						data: new Blob(["audio"])
					}
				]
			})
		).toThrow("duration_secs and waveform")
	})

	test("keeps voice metadata on the file payload", () => {
		const serialized = serializePayload({
			flags: MessageFlags.IsVoiceMessage,
			files: [
				{
					name: "voice.ogg",
					data: new Blob(["audio"]),
					duration_secs: 2.25,
					waveform: "AAECAw=="
				}
			]
		}) as {
			flags?: number
			files?: Array<{
				duration_secs?: number
				waveform?: string
			}>
		}

		expect(serialized.flags).toBe(MessageFlags.IsVoiceMessage)
		expect(serialized.files?.[0]).toMatchObject({
			duration_secs: 2.25,
			waveform: "AAECAw=="
		})
	})
})
