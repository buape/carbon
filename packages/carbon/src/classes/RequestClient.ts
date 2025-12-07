import { DiscordError } from "../errors/DiscordError.js"
import { RateLimitError } from "../errors/RatelimitError.js"
import type { MessagePayload, MessagePayloadFile } from "../types/index.js"

/**
 * The options used to initialize the RequestClient
 */
export type RequestClientOptions = {
	/**
	 * The header used to send the token in the request.
	 * This should generally always be "Bot" unless you are working with OAuth.
	 *
	 * @default "Bot"
	 */
	tokenHeader?: "Bot" | "Bearer"
	/**
	 * The base URL of the API.
	 * @default https://discord.com/api
	 */
	baseUrl?: string
	/**
	 * The version of the API to use.
	 * @default 10
	 */
	apiVersion?: number
	/**
	 * The user agent to use when making requests.
	 * @default DiscordBot (https://github.com/buape/carbon, v0.0.0)
	 */
	userAgent?: string
	/**
	 * The timeout for requests.
	 * @default 15000
	 */
	timeout?: number
	/**
	 * Whether or not to queue requests if you are rate limited.
	 * If this is true, requests will be queued and wait for the ratelimit to clear.
	 * If this is false, requests will be made immediately and will throw a RateLimitError if you are rate limited.
	 *
	 * @default true
	 */
	queueRequests?: boolean
	/**
	 * The maximum amount of queued requests before throwing.
	 * @default 1000
	 */
	maxQueueSize?: number
}

const defaultOptions: Required<RequestClientOptions> = {
	tokenHeader: "Bot",
	baseUrl: "https://discord.com/api",
	apiVersion: 10,
	userAgent: "DiscordBot (https://github.com/buape/carbon, v0.0.0)",
	timeout: 15000,
	queueRequests: true,
	maxQueueSize: 1000
}

export type QueuedRequest = {
	method: string
	path: string
	data?: RequestData
	query?: Record<string, string | number | boolean>
	resolve: (value?: unknown) => void
	reject: (reason?: unknown) => void
	routeKey: string
}

export type RequestData = {
	body?: unknown
	rawBody?: boolean
	headers?: Record<string, string>
}

/**
 * This is the main class that handles making requests to the Discord API.
 * It is used internally by Carbon, and you should not need to use it directly, but feel free to if you feel like living dangerously.
 */
export class RequestClient {
	/**
	 * The options used to initialize the client
	 */
	readonly options: RequestClientOptions
	protected queue: QueuedRequest[] = []
	private token: string
	private abortController: AbortController | null = null
	private processingQueue = false
	private routeBuckets: Map<string, string> = new Map()
	private bucketStates: Map<
		string,
		{
			delayUntil: number
			extraBackoff: number
			remaining: number
		}
	> = new Map()
	private globalRateLimitUntil = 0

	constructor(token: string, options?: RequestClientOptions) {
		this.token = token
		this.options = {
			...defaultOptions,
			...options
		}
	}

	async get(path: string, query?: QueuedRequest["query"]) {
		return await this.request("GET", path, { query })
	}

	async post(path: string, data?: RequestData, query?: QueuedRequest["query"]) {
		return await this.request("POST", path, { data, query })
	}

	async patch(
		path: string,
		data?: RequestData,
		query?: QueuedRequest["query"]
	) {
		return await this.request("PATCH", path, { data, query })
	}

	async put(path: string, data?: RequestData, query?: QueuedRequest["query"]) {
		return await this.request("PUT", path, { data, query })
	}

	async delete(
		path: string,
		data?: RequestData,
		query?: QueuedRequest["query"]
	) {
		return await this.request("DELETE", path, { data, query })
	}

	private async request(
		method: string,
		path: string,
		{ data, query }: { data?: RequestData; query?: QueuedRequest["query"] }
	): Promise<unknown> {
		const routeKey = this.getRouteKey(method, path)
		if (this.options.queueRequests) {
			if (
				typeof this.options.maxQueueSize === "number" &&
				this.options.maxQueueSize > 0 &&
				this.queue.length >= this.options.maxQueueSize
			) {
				const stats = this.queue.reduce(
					(acc, item) => {
						const count = (acc.counts.get(item.routeKey) ?? 0) + 1
						acc.counts.set(item.routeKey, count)
						if (count > acc.topCount) {
							acc.topCount = count
							acc.topRoute = item.routeKey
						}
						return acc
					},
					{
						counts: new Map<string, number>([[routeKey, 1]]),
						topRoute: routeKey,
						topCount: 1
					}
				)
				throw new Error(
					`Request queue is full (${this.queue.length} / ${this.options.maxQueueSize}), you should implement a queuing system in your requests or raise the queue size in Carbon. Top offender: ${stats.topRoute}`
				)
			}
			return new Promise((resolve, reject) => {
				this.queue.push({
					method,
					path,
					data,
					query,
					resolve,
					reject,
					routeKey
				})
				this.processQueue()
			})
		}
		return new Promise((resolve, reject) => {
			this.executeRequest({
				method,
				path,
				data,
				query,
				resolve,
				reject,
				routeKey
			})
				.then(resolve)
				.catch((err) => {
					reject(err)
				})
		})
	}

	private async executeRequest(request: QueuedRequest): Promise<unknown> {
		const { method, path, data, query, routeKey } = request
		await this.waitForBucket(routeKey)

		const queryString = query
			? `?${Object.entries(query)
					.map(
						([key, value]) =>
							`${encodeURIComponent(key)}=${encodeURIComponent(value)}`
					)
					.join("&")}`
			: ""
		const url = `${this.options.baseUrl}${path}${queryString}`
		const headers =
			this.token === "webhook"
				? new Headers()
				: new Headers({
						Authorization: `${this.options.tokenHeader} ${this.token}`
					})

		// Add custom headers if provided
		if (data?.headers) {
			for (const [key, value] of Object.entries(data.headers)) {
				headers.set(key, value)
			}
		}

		this.abortController = new AbortController()
		let body: BodyInit | undefined

		if (
			data?.body &&
			typeof data.body === "object" &&
			("files" in data.body ||
				("data" in data.body &&
					data.body.data &&
					typeof data.body.data === "object" &&
					"files" in data.body.data))
		) {
			const payload = data.body as MessagePayload
			if (typeof payload === "string") {
				data.body = { content: payload, attachments: [] }
			} else {
				data.body = { ...payload, attachments: [] }
			}

			const formData = new FormData()
			const files = (() => {
				if (typeof payload === "object" && payload !== null) {
					if ("files" in payload) {
						return (payload as { files?: MessagePayloadFile[] }).files || []
					}
					if (
						"data" in payload &&
						typeof payload.data === "object" &&
						payload.data !== null
					) {
						return (
							(payload as { data: { files?: MessagePayloadFile[] } }).data
								.files || []
						)
					}
				}
				return []
			})()

			for (const [index, file] of files.entries()) {
				let { data: fileData } = file

				if (!(fileData instanceof Blob)) {
					fileData = new Blob([fileData])
				}

				formData.append(`files[${index}]`, fileData, file.name)
				;(
					data.body as {
						attachments: Array<{
							id: number
							filename: string
							description?: string
						}>
					}
				).attachments.push({
					id: index,
					filename: file.name,
					description: file.description
				})
			}

			if (data.body != null) {
				const cleanedBody = {
					...data.body,
					files: undefined
				}
				formData.append("payload_json", JSON.stringify(cleanedBody))
			}

			body = formData
		} else if (data?.body != null) {
			headers.set("Content-Type", "application/json")
			if (data.rawBody) {
				body = data.body as unknown as BodyInit
			} else {
				body = JSON.stringify(data.body)
			}
		}

		const response = await fetch(url, {
			method,
			headers,
			body,
			signal: this.abortController.signal
		})

		let rawBody = ""
		let parsedBody: unknown
		try {
			rawBody = await response.text()
		} catch {
			rawBody = ""
		}
		if (rawBody.length > 0) {
			try {
				parsedBody = JSON.parse(rawBody)
			} catch {
				parsedBody = undefined
			}
		}

		if (response.status === 429) {
			const rateLimitBody =
				parsedBody &&
				typeof parsedBody === "object" &&
				"retry_after" in parsedBody &&
				"message" in parsedBody
					? (parsedBody as {
							message: string
							retry_after: number
							global: boolean
						})
					: {
							message:
								typeof parsedBody === "string"
									? parsedBody
									: rawBody || "You are being rate limited.",
							retry_after: (() => {
								const retryAfterHeader = response.headers.get("Retry-After")
								if (
									retryAfterHeader &&
									!Number.isNaN(Number(retryAfterHeader))
								) {
									return Number(retryAfterHeader)
								}
								return 1
							})(),
							global: response.headers.get("X-RateLimit-Scope") === "global"
						}
			const rateLimitError = new RateLimitError(response, rateLimitBody)
			this.scheduleRateLimit(routeKey, rateLimitError)
			throw rateLimitError
		}

		this.updateBucketFromHeaders(routeKey, response)

		if (response.status >= 400 && response.status < 600) {
			const discordErrorBody =
				parsedBody && typeof parsedBody === "object"
					? (parsedBody as {
							message: string
							code?: number
						})
					: {
							message: rawBody || "Discord API error",
							code: 0
						}
			throw new DiscordError(response, discordErrorBody)
		}

		if (parsedBody !== undefined) return parsedBody
		if (rawBody.length > 0) return rawBody
		return null
	}

	private async processQueue() {
		if (this.processingQueue) return
		this.processingQueue = true
		while (this.queue.length > 0) {
			const queueItem = this.queue.shift()
			if (!queueItem) continue
			const { resolve, reject } = queueItem
			try {
				const result = await this.executeRequest(queueItem)
				resolve(result)
			} catch (error) {
				if (error instanceof RateLimitError && this.options.queueRequests) {
					this.queue.unshift(queueItem)
				} else if (error instanceof Error) {
					reject(error)
				} else {
					reject(new Error("Unknown error during request", { cause: error }))
				}
			} finally {
				this.abortController = null
			}
		}
		this.processingQueue = false
		if (this.queue.length > 0) {
			this.processQueue()
		}
	}

	private async waitForBucket(routeKey: string) {
		while (true) {
			const now = Date.now()
			if (this.globalRateLimitUntil > now) {
				await sleep(this.globalRateLimitUntil - now)
				continue
			}
			const bucketId = this.routeBuckets.get(routeKey) ?? routeKey
			const bucket = this.bucketStates.get(bucketId)
			if (bucket && bucket.delayUntil > now) {
				await sleep(bucket.delayUntil - now)
				continue
			}
			break
		}
	}

	private scheduleRateLimit(routeKey: string, error: RateLimitError) {
		const bucketId = error.bucket ?? this.routeBuckets.get(routeKey) ?? routeKey
		const waitTime = Math.max(0, Math.ceil(error.retryAfter * 1000))
		const now = Date.now()
		const bucket = this.bucketStates.get(bucketId) ?? {
			delayUntil: 0,
			extraBackoff: 0,
			remaining: 0
		}
		const existingDelayPassed = bucket.delayUntil <= now
		const extraBackoff = existingDelayPassed
			? Math.min(bucket.extraBackoff ? bucket.extraBackoff * 2 : 1000, 60_000)
			: (bucket.extraBackoff ?? 0)
		const nextAvailable = now + waitTime + extraBackoff
		this.bucketStates.set(bucketId, {
			delayUntil: nextAvailable,
			extraBackoff,
			remaining: 0
		})
		this.routeBuckets.set(routeKey, bucketId)
		if (error.scope === "global") {
			this.globalRateLimitUntil = nextAvailable
		}
	}

	private updateBucketFromHeaders(routeKey: string, response: Response) {
		const bucketId = response.headers.get("X-RateLimit-Bucket")
		const remainingRaw = response.headers.get("X-RateLimit-Remaining")
		const resetAfterRaw = response.headers.get("X-RateLimit-Reset-After")
		const hasInfo = !!bucketId || !!remainingRaw || !!resetAfterRaw
		if (!hasInfo) return

		const key = bucketId ?? this.routeBuckets.get(routeKey) ?? routeKey
		if (bucketId) this.routeBuckets.set(routeKey, bucketId)
		const remaining = remainingRaw ? Number(remainingRaw) : undefined
		const resetAfter = resetAfterRaw ? Number(resetAfterRaw) * 1000 : undefined
		const now = Date.now()
		const bucket = this.bucketStates.get(key) ?? {
			delayUntil: 0,
			extraBackoff: 0,
			remaining: 1
		}

		if (typeof remaining === "number" && !Number.isNaN(remaining)) {
			bucket.remaining = remaining
		}
		if (
			typeof resetAfter === "number" &&
			!Number.isNaN(resetAfter) &&
			bucket.remaining <= 0
		) {
			bucket.delayUntil = now + resetAfter
		} else if (bucket.remaining > 0) {
			bucket.delayUntil = 0
		}
		bucket.extraBackoff = 0
		this.bucketStates.set(key, bucket)
	}

	private getRouteKey(method: string, path: string) {
		const segments = path.split("/")
		const normalized = segments
			.map((segment, index) => {
				if (!/^\d{16,}$/.test(segment)) return segment
				const prev = segments[index - 1]
				if (prev && ["channels", "guilds", "webhooks"].includes(prev)) {
					return ":id"
				}
				return ":id"
			})
			.join("/")
		return `${method}:${normalized}`
	}

	clearQueue() {
		this.queue = []
	}

	get queueSize() {
		return this.queue.length
	}

	abortAllRequests() {
		if (this.abortController) {
			this.abortController.abort()
		}
		this.clearQueue()
	}
}

const sleep = (ms: number) =>
	new Promise((resolve) => setTimeout(resolve, Math.max(ms, 0)))
