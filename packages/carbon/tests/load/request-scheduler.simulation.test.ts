import { expect, test, vi } from "vitest"
import { RequestClient } from "../../src/classes/RequestClient.js"

const mockFetch = vi.fn()
global.fetch = mockFetch

const createMockResponse = (status: number, body: unknown) => ({
	status,
	headers: new Headers(),
	text: async () => JSON.stringify(body)
})

test("Request scheduler simulation: critical traffic progresses under background pressure", async () => {
	mockFetch.mockReset()
	mockFetch.mockImplementation(async () =>
		createMockResponse(200, { ok: true })
	)

	const client = new RequestClient("test-token", {
		baseUrl: "https://discord.com/api",
		scheduler: {
			maxConcurrency: 4,
			lanes: {
				critical: { weight: 8, maxQueueSize: 500 },
				standard: { weight: 2, maxQueueSize: 500 },
				background: { weight: 1, maxQueueSize: 500 }
			}
		}
	})

	const completionOrder: string[] = []
	const tasks: Promise<unknown>[] = []

	for (let index = 0; index < 120; index += 1) {
		tasks.push(
			client.get(`/guilds/${index}`).then((value) => {
				completionOrder.push(`background-${index}`)
				return value
			})
		)
	}

	for (let index = 0; index < 20; index += 1) {
		tasks.push(
			client
				.post(`/interactions/${index}/token/callback`, { body: { type: 5 } })
				.then((value) => {
					completionOrder.push(`critical-${index}`)
					return value
				})
		)
	}

	await Promise.all(tasks)

	const firstCritical = completionOrder.findIndex((entry) =>
		entry.startsWith("critical-")
	)
	const firstThirty = completionOrder.slice(0, 30)
	const criticalInFirstThirty = firstThirty.filter((entry) =>
		entry.startsWith("critical-")
	).length

	expect(firstCritical).toBeGreaterThanOrEqual(0)
	expect(criticalInFirstThirty).toBeGreaterThan(5)
})
