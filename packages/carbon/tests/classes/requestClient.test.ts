import { beforeEach, expect, test, vi } from "vitest"
import { DiscordError, RateLimitError, RequestClient } from "../../src/index.js"

const mockFetch = vi.fn()

global.fetch = mockFetch

const clientOptions = {
	baseUrl: "https://discord.com/api"
}

const createMockResponse = (
	status: number,
	body: unknown,
	headers?: Record<string, string>
) => ({
	status,
	headers: new Headers(headers),
	text: async () => JSON.stringify(body)
})

beforeEach(() => {
	mockFetch.mockReset()
})

test("RequestClient: successful GET request", async () => {
	const requestClient = new RequestClient("test-token", clientOptions)
	const mockResponse = { data: "test data" }

	mockFetch.mockResolvedValueOnce(createMockResponse(200, mockResponse))

	const response = await requestClient.get("/test-path")
	expect(response).toEqual(mockResponse)
})

test("RequestClient: handles DiscordError", async () => {
	const requestClient = new RequestClient("test-token", clientOptions)

	mockFetch.mockResolvedValueOnce(
		createMockResponse(400, {
			code: 50035,
			message: "Invalid Form Body",
			errors: {
				activities: {
					"0": {
						platform: {
							_errors: [
								{
									code: "BASE_TYPE_CHOICES",
									message: "Value must be one of ('desktop', 'android', 'ios')."
								}
							]
						},
						type: {
							_errors: [
								{
									code: "BASE_TYPE_CHOICES",
									message: "Value must be one of (0, 1, 2, 3, 4, 5)."
								}
							]
						}
					}
				}
			}
		})
	)

	await expect(requestClient.get("/invalid-path")).rejects.toThrow(DiscordError)
})

test("RequestClient: processes queue", async () => {
	const requestClient = new RequestClient("test-token", clientOptions)
	const mockResponse = { data: "test data" }

	mockFetch.mockResolvedValue(createMockResponse(200, mockResponse))

	const promise1 = requestClient.get("/test-path-1")
	const promise2 = requestClient.get("/test-path-2")

	const [response1, response2] = await Promise.all([promise1, promise2])

	expect(response1).toEqual(mockResponse)
	expect(response2).toEqual(mockResponse)
})

test("RequestClient: scopes rate limits by major parameter", async () => {
	vi.useFakeTimers()
	try {
		const requestClient = new RequestClient("test-token", {
			...clientOptions,
			queueRequests: false
		})

		mockFetch
			.mockResolvedValueOnce(
				createMockResponse(
					429,
					{
						message: "You are being rate limited.",
						retry_after: 1,
						global: false
					},
					{
						"X-RateLimit-Bucket": "bucket-1",
						"X-RateLimit-Scope": "shared"
					}
				)
			)
			.mockResolvedValueOnce(createMockResponse(200, { ok: true }))

		await expect(requestClient.get("/channels/111/messages")).rejects.toThrow(
			RateLimitError
		)

		await expect(requestClient.get("/channels/222/messages")).resolves.toEqual({
			ok: true
		})
	} finally {
		vi.useRealTimers()
	}
})

test("RequestClient: waits on the same major bucket", async () => {
	vi.useFakeTimers()
	try {
		const requestClient = new RequestClient("test-token", {
			...clientOptions,
			queueRequests: false
		})

		mockFetch
			.mockResolvedValueOnce(
				createMockResponse(
					429,
					{
						message: "You are being rate limited.",
						retry_after: 1,
						global: false
					},
					{
						"X-RateLimit-Bucket": "bucket-1",
						"X-RateLimit-Scope": "shared"
					}
				)
			)
			.mockResolvedValueOnce(createMockResponse(200, { ok: true }))

		await expect(requestClient.get("/channels/111/messages")).rejects.toThrow(
			RateLimitError
		)

		let resolved = false
		const followup = requestClient.get("/channels/111/messages").then(() => {
			resolved = true
		})

		await Promise.resolve()
		expect(mockFetch).toHaveBeenCalledTimes(1)
		expect(resolved).toBe(false)

		await vi.advanceTimersByTimeAsync(2100)
		await followup
		expect(mockFetch).toHaveBeenCalledTimes(2)
	} finally {
		vi.useRealTimers()
	}
})
