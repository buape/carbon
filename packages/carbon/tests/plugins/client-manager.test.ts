import { describe, expect, test, vi } from "vitest"

vi.mock("../../src/structures/Message.js", () => ({
	Message: class Message {}
}))
vi.mock("../../src/plugins/paginator/index.js", () => ({}))

import {
	ClientManager,
	type ClientManagerOptions,
	type ClientSetupOptions
} from "../../src/plugins/client-manager/ClientManager.js"

const baseOptions = {
	baseUrl: "https://example.com/apps",
	deploySecret: "secret",
	sharedOptions: {} as ClientManagerOptions["sharedOptions"]
}

function buildApplications(total: number) {
	return Array.from({ length: total }, (_, index) => ({
		clientId: `${10_000_000_000_000_000n + BigInt(index)}`,
		publicKey: "public",
		token: `token-${index}`
	}))
}

describe("ClientManager startup orchestration", () => {
	test("limits startup fanout with configured concurrency", async () => {
		class ConcurrencyManager extends ClientManager {
			running = 0
			peak = 0
			override async setupClient(
				credentials: {
					clientId: string
					publicKey: string | string[]
					token: string
				},
				_options?: ClientSetupOptions
			) {
				this.running += 1
				this.peak = Math.max(this.peak, this.running)
				await new Promise((resolve) => setTimeout(resolve, 10))
				this.running -= 1
				return {
					options: {
						clientId: credentials.clientId
					}
				} as never
			}
		}

		const manager = new ConcurrencyManager(
			{
				...baseOptions,
				applications: buildApplications(6),
				startup: {
					concurrency: 2
				}
			},
			{},
			[]
		)

		const result = await manager.whenReady()
		expect(result.total).toBe(6)
		expect(result.failures).toBe(0)
		expect(result.successes).toBe(6)
		expect(manager.peak).toBeLessThanOrEqual(2)
	})

	test("supports failFast startup strategy", async () => {
		class FailingManager extends ClientManager {
			attempted = 0
			override async setupClient(
				credentials: {
					clientId: string
					publicKey: string | string[]
					token: string
				},
				_options?: ClientSetupOptions
			) {
				this.attempted += 1
				if (credentials.clientId.endsWith("0")) {
					throw new Error("boom")
				}
				await new Promise((resolve) => setTimeout(resolve, 5))
				return {
					options: {
						clientId: credentials.clientId
					}
				} as never
			}
		}

		const consoleErrorSpy = vi
			.spyOn(console, "error")
			.mockImplementation(() => undefined)

		const manager = new FailingManager(
			{
				...baseOptions,
				applications: buildApplications(5),
				startup: {
					concurrency: 3,
					failFast: true
				}
			},
			{},
			[]
		)

		await expect(manager.whenReady()).rejects.toThrow("startup failed")
		expect(manager.attempted).toBeLessThan(5)
		expect(consoleErrorSpy).toHaveBeenCalled()
		consoleErrorSpy.mockRestore()
	})
})
