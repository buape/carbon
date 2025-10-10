/** biome-ignore-all lint/style/noNonNullAssertion: WEBHOOK_URL checks */
import { describe, expect, test } from "vitest"
import { Webhook } from "../../src/index.js"

const WEBHOOK_URL = process.env.WEBHOOK_URL

describe("Webhook Constructor", () => {
	test("creates webhook from URL string", () => {
		const webhook = new Webhook(
			"https://discord.com/api/webhooks/123456789012345678/test_webhook_token_12345"
		)

		expect(webhook.id).toBe("123456789012345678")
		expect(webhook.token).toBe("test_webhook_token_12345")
		expect(webhook.partial).toBe(true)
	})

	test("creates webhook from URL string with thread_id", () => {
		const webhook = new Webhook(
			"https://discord.com/api/webhooks/123456789012345678/test_webhook_token_12345?thread_id=999888777666555444"
		)

		expect(webhook.id).toBe("123456789012345678")
		expect(webhook.token).toBe("test_webhook_token_12345")
		expect(webhook.threadId).toBe("999888777666555444")
	})

	test("throws error for invalid URL protocol", () => {
		expect(
			() =>
				new Webhook(
					"ftp://discord.com/api/webhooks/123456789012345678/test_webhook_token_12345"
				)
		).toThrow("Invalid URL")
	})

	test("throws error for invalid URL format (missing parts)", () => {
		expect(
			() => new Webhook("https://discord.com/api/webhooks/123456789012345678")
		).toThrow("Invalid URL")
	})

	test("creates webhook from id/token object", () => {
		const webhook = new Webhook({
			id: "123456789012345678",
			token: "test_webhook_token_12345"
		})

		expect(webhook.id).toBe("123456789012345678")
		expect(webhook.token).toBe("test_webhook_token_12345")
		expect(webhook.partial).toBe(true)
	})

	test("creates webhook from id/token object with threadId", () => {
		const webhook = new Webhook({
			id: "123456789012345678",
			token: "test_webhook_token_12345",
			threadId: "999888777666555444"
		})

		expect(webhook.id).toBe("123456789012345678")
		expect(webhook.token).toBe("test_webhook_token_12345")
		expect(webhook.threadId).toBe("999888777666555444")
	})
})

describe("Webhook Methods", async () => {
	test.skipIf(!WEBHOOK_URL)("Sending a message", async () => {
		const webhook = new Webhook(WEBHOOK_URL!)
		const message = await webhook.send(
			{
				content: "Hello, world!"
			},
			undefined,
			true
		)
		expect(message).toBeDefined()
		expect(message.content).toBe("Hello, world!")
	})

	test.skipIf(!WEBHOOK_URL)("Getting a message", async () => {
		const webhook = new Webhook(WEBHOOK_URL!)
		const message = await webhook.send(
			{
				content: "Get this message!"
			},
			undefined,
			true
		)
		expect(message).toBeDefined()
		expect(message.content).toBe("Get this message!")
		const fetchedMessage = await webhook.getMessage(message.id)
		expect(fetchedMessage.content).toBe("Get this message!")
	})

	test.skipIf(!WEBHOOK_URL)("Editing a message", async () => {
		const webhook = new Webhook(WEBHOOK_URL!)
		const message = await webhook.send(
			{
				content: "Edit this message!"
			},
			undefined,
			true
		)
		expect(message).toBeDefined()
		expect(message.content).toBe("Edit this message!")
		const editedMessage = await webhook.edit(message.id, {
			content: "Edited message!"
		})
		expect(editedMessage.content).toBe("Edited message!")
	})

	test.skipIf(!WEBHOOK_URL)("Deleting a message", async () => {
		const webhook = new Webhook(WEBHOOK_URL!)
		const message = await webhook.send(
			{
				content: "Delete this message!"
			},
			undefined,
			true
		)
		expect(message).toBeDefined()
		expect(message.content).toBe("Delete this message!")
		await webhook.deleteMessage(message.id)
		const fetchedMessage = await webhook
			.getMessage(message.id)
			.catch(() => undefined)
		expect(fetchedMessage).toBeUndefined()
	})
})
