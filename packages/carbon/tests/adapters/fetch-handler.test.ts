import { describe, expect, test, vi } from "vitest"

vi.mock("../../src/structures/Message.js", () => ({
	Message: class Message {}
}))
vi.mock("../../src/plugins/paginator/index.js", () => ({}))

import { createHandler } from "../../src/adapters/fetch/index.js"
import { Client } from "../../src/classes/Client.js"
import type { ClientManager } from "../../src/plugins/client-manager/ClientManager.js"

describe("fetch adapter handler", () => {
	test("routes client requests using baseUrl path", async () => {
		const client = new Client(
			{
				baseUrl: "https://example.com/bot",
				clientId: "123",
				deploySecret: "secret",
				publicKey: "public",
				token: "token",
				disableDeployRoute: true,
				disableEventsRoute: true
			},
			{},
			[]
		)
		const handler = createHandler(client)

		const response = await handler(
			new Request("https://example.com/bot/interactions", {
				method: "POST",
				body: "{}"
			}),
			{}
		)

		expect(response.status).toBe(401)
	})

	test("returns method not allowed for known path wrong method", async () => {
		const client = new Client(
			{
				baseUrl: "https://example.com/bot",
				clientId: "123",
				deploySecret: "secret",
				publicKey: "public",
				token: "token",
				disableDeployRoute: true,
				disableEventsRoute: true
			},
			{},
			[]
		)
		const handler = createHandler(client)

		const response = await handler(
			new Request("https://example.com/bot/interactions", {
				method: "GET"
			}),
			{}
		)

		expect(response.status).toBe(405)
	})

	test("delegates to client manager handleRequest", async () => {
		const handleRequest = vi
			.fn()
			.mockResolvedValue(new Response("ok", { status: 200 }))
		const manager = {
			handleRequest
		} as unknown as ClientManager
		const handler = createHandler(manager)

		const response = await handler(
			new Request("https://example.com/anything", {
				method: "POST"
			}),
			{}
		)

		expect(handleRequest).toHaveBeenCalledOnce()
		expect(response.status).toBe(200)
	})
})
