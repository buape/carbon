import { MessageFlags } from "discord-api-types/v10"
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

test("RequestClient: includes method and url on RateLimitError", async () => {
	const requestClient = new RequestClient("test-token", {
		...clientOptions,
		queueRequests: false
	})

	mockFetch.mockResolvedValueOnce(
		createMockResponse(429, {
			message: "You are being rate limited.",
			retry_after: 1,
			global: false
		})
	)

	try {
		await requestClient.get("/rate-limited")
		expect.unreachable("Expected request to throw RateLimitError")
	} catch (error) {
		expect(error).toBeInstanceOf(RateLimitError)
		const rateLimit = error as RateLimitError
		expect(rateLimit.method).toBe("GET")
		expect(rateLimit.url).toBe("https://discord.com/api/rate-limited")
	}
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

test("RequestClient: serializes voice attachment metadata into payload_json", async () => {
	const requestClient = new RequestClient("test-token", clientOptions)
	mockFetch.mockResolvedValueOnce(createMockResponse(200, { ok: true }))

	await requestClient.post("/test-path", {
		body: {
			flags: MessageFlags.IsVoiceMessage,
			files: [
				{
					name: "voice.ogg",
					data: new Blob(["audio"]),
					duration_secs: 1.23,
					waveform: "AAECAw=="
				}
			]
		}
	})

	expect(mockFetch).toHaveBeenCalledTimes(1)
	const [, requestInit] = mockFetch.mock.calls[0] as [string, RequestInit]
	const formData = requestInit.body as FormData
	const payloadJson = formData.get("payload_json")
	expect(typeof payloadJson).toBe("string")
	if (typeof payloadJson !== "string") return
	const parsed = JSON.parse(payloadJson) as {
		files?: unknown
		attachments?: Array<{
			id: number
			filename: string
			duration_secs?: number
			waveform?: string
		}>
	}

	expect(parsed.files).toBeUndefined()
	expect(parsed.attachments).toEqual([
		{
			id: 0,
			filename: "voice.ogg",
			duration_secs: 1.23,
			waveform: "AAECAw=="
		}
	])
})

test("RequestClient: serializes nested interaction files to data.attachments", async () => {
	const requestClient = new RequestClient("test-token", clientOptions)
	mockFetch.mockResolvedValueOnce(createMockResponse(200, { ok: true }))

	await requestClient.post("/test-path", {
		body: {
			type: 4,
			data: {
				files: [
					{
						name: "voice.ogg",
						data: new Blob(["audio"]),
						duration_secs: 2.5,
						waveform: "AQID"
					}
				]
			}
		}
	})

	expect(mockFetch).toHaveBeenCalledTimes(1)
	const [, requestInit] = mockFetch.mock.calls[0] as [string, RequestInit]
	const formData = requestInit.body as FormData
	const payloadJson = formData.get("payload_json")
	expect(typeof payloadJson).toBe("string")
	if (typeof payloadJson !== "string") return
	const parsed = JSON.parse(payloadJson) as {
		attachments?: unknown
		data: {
			files?: unknown
			attachments?: Array<{
				id: number
				filename: string
				duration_secs?: number
				waveform?: string
			}>
		}
	}

	expect(parsed.attachments).toBeUndefined()
	expect(parsed.data.files).toBeUndefined()
	expect(parsed.data.attachments).toEqual([
		{
			id: 0,
			filename: "voice.ogg",
			duration_secs: 2.5,
			waveform: "AQID"
		}
	])
})

test("RequestClient: uses custom fetch function when provided", async () => {
	const customFetch = vi
		.fn()
		.mockResolvedValueOnce(createMockResponse(200, { custom: true }))

	const requestClient = new RequestClient("test-token", {
		...clientOptions,
		fetch: customFetch
	})

	const response = await requestClient.get("/test-path")

	expect(customFetch).toHaveBeenCalledTimes(1)
	expect(customFetch).toHaveBeenCalledWith(
		expect.stringContaining("/test-path"),
		expect.objectContaining({ method: "GET" })
	)
	expect(response).toEqual({ custom: true })
	expect(mockFetch).not.toHaveBeenCalled()
})

test("RequestClient: falls back to global fetch when custom fetch not provided", async () => {
	const requestClient = new RequestClient("test-token", clientOptions)
	const mockResponse = { data: "test data" }

	mockFetch.mockResolvedValueOnce(createMockResponse(200, mockResponse))

	const response = await requestClient.get("/test-path")

	expect(mockFetch).toHaveBeenCalledTimes(1)
	expect(response).toEqual(mockResponse)
})

test("RequestClient: prioritizes interaction callbacks over queued background traffic", async () => {
	let firstCallResolved = false
	let releaseFirstCall: (() => void) | undefined
	mockFetch.mockImplementation(() => {
		if (!firstCallResolved) {
			firstCallResolved = true
			return new Promise((resolve) => {
				releaseFirstCall = () => resolve(createMockResponse(200, { ok: true }))
			})
		}
		return Promise.resolve(createMockResponse(200, { ok: true }))
	})

	const requestClient = new RequestClient("test-token", {
		...clientOptions,
		scheduler: {
			maxConcurrency: 1,
			lanes: {
				critical: { weight: 10, maxQueueSize: 100 },
				standard: { weight: 2, maxQueueSize: 100 },
				background: { weight: 1, maxQueueSize: 100 }
			}
		}
	})

	const background = Array.from({ length: 4 }, (_, index) =>
		requestClient.get(`/guilds/${index}/roles`)
	)
	const callback = requestClient.post("/interactions/123/token/callback", {
		body: {
			type: 5
		}
	})

	await Promise.resolve()
	expect(mockFetch).toHaveBeenCalledTimes(1)
	releaseFirstCall?.()
	await new Promise((resolve) => setTimeout(resolve, 0))

	expect(mockFetch.mock.calls.length).toBeGreaterThanOrEqual(2)
	const secondUrl = mockFetch.mock.calls[1]?.[0] as string
	expect(secondUrl).toContain("/interactions/123/token/callback")

	await Promise.all([...background, callback])
})

test("RequestClient: drops stale low-priority requests under backlog", async () => {
	vi.useFakeTimers()
	try {
		const resolvers: Array<() => void> = []
		mockFetch.mockImplementation(
			() =>
				new Promise((resolve) => {
					resolvers.push(() => resolve(createMockResponse(200, { ok: true })))
				})
		)

		const requestClient = new RequestClient("test-token", {
			...clientOptions,
			scheduler: {
				maxConcurrency: 1,
				lanes: {
					background: {
						maxQueueSize: 50,
						staleAfterMs: 25
					}
				}
			}
		})

		const first = requestClient.get("/guilds/111")
		const second = requestClient.get("/guilds/222")

		await Promise.resolve()
		await vi.advanceTimersByTimeAsync(50)
		resolvers.shift()?.()

		await first
		await expect(second).rejects.toThrow("Dropped stale background request")
	} finally {
		vi.useRealTimers()
	}
})

test("RequestClient: applies legacy maxQueueSize when lane sizes are not configured", async () => {
	let fetchCount = 0
	let releaseFirst: (() => void) | undefined
	mockFetch.mockImplementation(() => {
		fetchCount += 1
		if (fetchCount === 1) {
			return new Promise((resolve) => {
				releaseFirst = () => resolve(createMockResponse(200, { ok: true }))
			})
		}
		return Promise.resolve(createMockResponse(200, { ok: true }))
	})

	const requestClient = new RequestClient("test-token", {
		...clientOptions,
		maxQueueSize: 1,
		scheduler: {
			maxConcurrency: 1
		}
	})

	const first = requestClient.get("/guilds/111")
	const second = requestClient.get("/guilds/222")
	const third = requestClient.get("/guilds/333")

	await Promise.resolve()
	releaseFirst?.()

	await expect(third).rejects.toThrow("Request queue for background is full")
	await Promise.all([first, second])
})

test("RequestClient: wakeup timer reschedules when a shorter wait appears", async () => {
	vi.useFakeTimers()
	try {
		mockFetch.mockResolvedValue(createMockResponse(200, { ok: true }))

		const requestClient = new RequestClient("test-token", {
			...clientOptions,
			scheduler: {
				maxConcurrency: 1
			}
		})

		const internals = requestClient as unknown as {
			getRouteKey(method: string, path: string): string
			bucketStates: Map<
				string,
				{
					delayUntil: number
					extraBackoff: number
					remaining: number
				}
			>
		}

		const now = Date.now()
		const longRoute = internals.getRouteKey("GET", "/channels/111/messages")
		const shortRoute = internals.getRouteKey("GET", "/channels/222/messages")
		internals.bucketStates.set(longRoute, {
			delayUntil: now + 1_000,
			extraBackoff: 0,
			remaining: 0
		})
		internals.bucketStates.set(shortRoute, {
			delayUntil: now + 100,
			extraBackoff: 0,
			remaining: 0
		})

		const longRequest = requestClient.get("/channels/111/messages")
		const shortRequest = requestClient.get("/channels/222/messages")

		await vi.advanceTimersByTimeAsync(150)
		expect(mockFetch).toHaveBeenCalledTimes(1)
		expect(String(mockFetch.mock.calls[0]?.[0])).toContain(
			"/channels/222/messages"
		)

		await vi.advanceTimersByTimeAsync(1_000)
		await Promise.all([longRequest, shortRequest])
	} finally {
		vi.useRealTimers()
	}
})

test("RequestClient: delayed bucket does not block other routes", async () => {
	vi.useFakeTimers()
	try {
		let firstBucketRequest = true
		mockFetch.mockImplementation(async (url) => {
			const input = String(url)
			if (input.includes("/channels/111/messages") && firstBucketRequest) {
				firstBucketRequest = false
				return createMockResponse(
					429,
					{
						message: "You are being rate limited.",
						retry_after: 0.05,
						global: false
					},
					{
						"X-RateLimit-Bucket": "bucket-1",
						"X-RateLimit-Scope": "shared"
					}
				)
			}
			return createMockResponse(200, { ok: true, input })
		})

		const requestClient = new RequestClient("test-token", {
			...clientOptions,
			scheduler: {
				maxConcurrency: 1
			}
		})

		const one = requestClient.get("/channels/111/messages")
		const two = requestClient.get("/channels/111/messages")
		const other = requestClient.get("/channels/222/messages")

		await vi.advanceTimersByTimeAsync(1)
		expect(mockFetch.mock.calls.length).toBeGreaterThanOrEqual(2)
		const secondUrl = String(mockFetch.mock.calls[1]?.[0])
		expect(secondUrl).toContain("/channels/222/messages")

		await vi.advanceTimersByTimeAsync(1_200)
		await Promise.all([one, two, other])
	} finally {
		vi.useRealTimers()
	}
})

test("RequestClient: bounded retries reject after maxRateLimitRetries", async () => {
	vi.useFakeTimers()
	try {
		mockFetch.mockResolvedValue(
			createMockResponse(429, {
				message: "You are being rate limited.",
				retry_after: 0,
				global: false
			})
		)

		const requestClient = new RequestClient("test-token", {
			...clientOptions,
			scheduler: {
				maxConcurrency: 1,
				maxRateLimitRetries: 1
			}
		})

		const failing = requestClient.get("/will-fail")
		const rejection = expect(failing).rejects.toBeInstanceOf(RateLimitError)
		await vi.advanceTimersByTimeAsync(2_200)
		await rejection
		expect(mockFetch).toHaveBeenCalledTimes(2)
	} finally {
		vi.useRealTimers()
	}
})

test("RequestClient: throws for invalid scheduler maxConcurrency", () => {
	expect(
		() =>
			new RequestClient("test-token", {
				...clientOptions,
				scheduler: {
					maxConcurrency: 0
				}
			})
	).toThrow("scheduler.maxConcurrency")
})
