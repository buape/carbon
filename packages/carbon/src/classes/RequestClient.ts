import { DiscordError } from "../errors/DiscordError.js"
import { RateLimitError } from "../errors/RatelimitError.js"
import { serializeRequestBody } from "../internals/RequestBody.js"
import {
	type RequestSchedulerOptions as InternalRequestSchedulerOptions,
	normalizeRequestSchedulerOptions,
	type RequestLane,
	RequestScheduler
} from "../internals/RequestScheduler.js"

export type RuntimeProfile = "serverless" | "persistent"
export type RequestPriority = RequestLane
export type RequestSchedulerOptions = InternalRequestSchedulerOptions

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
	 * Legacy global max queue size. In lane-based scheduler mode this is used as fallback
	 * when lane-specific max queue sizes are not configured.
	 *
	 * @default 1000
	 */
	maxQueueSize?: number
	/**
	 * Runtime profile used to derive scheduler defaults.
	 *
	 * @default "serverless"
	 */
	runtimeProfile?: RuntimeProfile
	/**
	 * Scheduler controls for weighted fairness and backpressure.
	 */
	scheduler?: RequestSchedulerOptions
	/**
	 * A custom fetch function to use for requests.
	 * This allows you to inject your own fetch implementation for proxy support,
	 * testing, mocking, or custom transport layers.
	 */
	fetch?: (
		input: string | URL | Request,
		init?: RequestInit
	) => Promise<Response>
}

const defaultOptions: Required<
	Omit<RequestClientOptions, "fetch" | "scheduler">
> = {
	tokenHeader: "Bot",
	baseUrl: "https://discord.com/api",
	apiVersion: 10,
	userAgent: "DiscordBot (https://github.com/buape/carbon, v0.0.0)",
	timeout: 15000,
	queueRequests: true,
	maxQueueSize: 1000,
	runtimeProfile: "serverless"
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

type ScheduledRequest = QueuedRequest & {
	id: number
	priority: RequestPriority
	enqueuedAt: number
	retryCount: number
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
	protected token: string
	protected customFetch:
		| ((input: string | URL | Request, init?: RequestInit) => Promise<Response>)
		| undefined

	protected nextRequestId = 0
	protected wakeupTimer: ReturnType<typeof setTimeout> | null = null
	protected wakeupDueAt: number | null = null
	protected activeWorkers = 0
	protected activeBucketKeys = new Set<string>()
	protected maxConcurrentWorkers = 1
	protected maxRateLimitRetries = 2
	protected scheduler!: RequestScheduler<ScheduledRequest>

	protected routeBuckets: Map<string, string> = new Map()
	protected bucketStates: Map<
		string,
		{
			delayUntil: number
			extraBackoff: number
			remaining: number
		}
	> = new Map()
	protected globalRateLimitUntil = 0
	protected requestControllers = new Set<AbortController>()

	constructor(token: string, options?: RequestClientOptions) {
		this.token = token
		this.customFetch = options?.fetch
		this.options = {
			...defaultOptions,
			...options
		}

		this.configureScheduler()
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

	protected configureScheduler() {
		const normalized = normalizeRequestSchedulerOptions({
			runtimeProfile: this.options.runtimeProfile ?? "serverless",
			maxQueueSize: this.options.maxQueueSize,
			scheduler: this.options.scheduler
		})
		this.maxConcurrentWorkers = normalized.maxConcurrency
		this.maxRateLimitRetries = normalized.maxRateLimitRetries
		this.scheduler = new RequestScheduler<ScheduledRequest>({
			lanes: normalized.lanes
		})
	}

	protected async request(
		method: string,
		path: string,
		{ data, query }: { data?: RequestData; query?: QueuedRequest["query"] }
	): Promise<unknown> {
		const routeKey = this.getRouteKey(method, path)
		if (!this.options.queueRequests) {
			return new Promise((resolve, reject) => {
				this.executeRequest({
					id: this.nextRequestId++,
					method,
					path,
					data,
					query,
					resolve,
					reject,
					routeKey,
					priority: this.getPriority(method, path),
					enqueuedAt: Date.now(),
					retryCount: 0
				})
					.then(resolve)
					.catch((err) => {
						reject(err)
					})
			})
		}

		return new Promise((resolve, reject) => {
			const priority = this.getPriority(method, path)
			const enqueueError = this.enqueueRequest({
				id: this.nextRequestId++,
				method,
				path,
				data,
				query,
				resolve,
				reject,
				routeKey,
				priority,
				enqueuedAt: Date.now(),
				retryCount: 0
			})
			if (enqueueError) {
				reject(enqueueError)
				return
			}
			this.pumpQueue()
		})
	}

	protected enqueueRequest(request: ScheduledRequest): Error | null {
		return this.scheduler.enqueue(request)
	}

	protected pumpQueue() {
		if (!this.options.queueRequests) return

		while (this.activeWorkers < this.maxConcurrentWorkers) {
			const next = this.takeNextReadyRequest()
			if (!next) return
			this.activeWorkers += 1
			const bucketKey = this.getCurrentBucketKey(next.routeKey)
			this.activeBucketKeys.add(bucketKey)
			this.runQueuedRequest(next)
				.catch((error) => {
					console.error("[RequestClient] Queue worker failed", error)
				})
				.finally(() => {
					this.activeBucketKeys.delete(bucketKey)
					this.activeWorkers -= 1
					this.pumpQueue()
				})
		}
	}

	protected async runQueuedRequest(request: ScheduledRequest) {
		try {
			const result = await this.executeRequest(request)
			request.resolve(result)
		} catch (error) {
			if (
				error instanceof RateLimitError &&
				this.options.queueRequests &&
				request.retryCount < this.maxRateLimitRetries
			) {
				const enqueueError = this.enqueueRequest({
					...request,
					retryCount: request.retryCount + 1,
					enqueuedAt: Date.now()
				})
				if (enqueueError) {
					request.reject(enqueueError)
					return
				}
				return
			}

			if (error instanceof Error) {
				request.reject(error)
				return
			}
			request.reject(
				new Error("Unknown error during request", { cause: error })
			)
		}
	}

	protected takeNextReadyRequest() {
		const next = this.scheduler.takeNext({
			isRouteReady: (routeKey) => this.getRouteWaitTime(routeKey),
			isBucketActive: (routeKey) =>
				this.activeBucketKeys.has(this.getCurrentBucketKey(routeKey))
		})
		if (!next.request) {
			if (next.waitMs !== null) {
				this.scheduleWakeup(next.waitMs)
			}
			return null
		}
		this.clearWakeupTimer()
		return next.request
	}

	protected scheduleWakeup(waitMs: number) {
		if (waitMs <= 0) {
			this.clearWakeupTimer()
			this.pumpQueue()
			return
		}

		const dueAt = Date.now() + waitMs
		if (
			this.wakeupTimer &&
			this.wakeupDueAt !== null &&
			this.wakeupDueAt <= dueAt
		) {
			return
		}
		if (this.wakeupTimer) {
			clearTimeout(this.wakeupTimer)
			this.wakeupTimer = null
		}

		this.wakeupDueAt = dueAt
		this.wakeupTimer = setTimeout(
			() => {
				this.wakeupTimer = null
				this.wakeupDueAt = null
				this.pumpQueue()
			},
			Math.max(0, dueAt - Date.now())
		)
	}

	protected clearWakeupTimer() {
		if (!this.wakeupTimer) {
			this.wakeupDueAt = null
			return
		}
		clearTimeout(this.wakeupTimer)
		this.wakeupTimer = null
		this.wakeupDueAt = null
	}

	protected getRouteWaitTime(routeKey: string, now = Date.now()) {
		if (this.globalRateLimitUntil > now) {
			return this.globalRateLimitUntil - now
		}
		const bucketKey = this.getCurrentBucketKey(routeKey)
		const bucket = this.bucketStates.get(bucketKey)
		if (bucket && bucket.delayUntil > now) {
			return bucket.delayUntil - now
		}
		return 0
	}

	protected getPriority(method: string, path: string): RequestPriority {
		const normalizedPath = path.toLowerCase()
		const normalizedMethod = method.toUpperCase()

		if (/^\/interactions\/\d+\/[^/]+\/callback$/.test(normalizedPath)) {
			return "critical"
		}

		if (
			normalizedPath.startsWith("/webhooks/") &&
			(normalizedMethod === "POST" ||
				normalizedMethod === "PATCH" ||
				normalizedMethod === "DELETE")
		) {
			return "standard"
		}

		if (
			normalizedMethod !== "GET" &&
			/\/channels\/\d+\/messages/.test(normalizedPath)
		) {
			return "standard"
		}

		return "background"
	}

	protected async executeRequest(request: ScheduledRequest): Promise<unknown> {
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
		const originalRequest = new Request(url, { method })
		const headers =
			this.token === "webhook"
				? new Headers()
				: new Headers({
						Authorization: `${this.options.tokenHeader} ${this.token}`
					})

		if (data?.headers) {
			for (const [key, value] of Object.entries(data.headers)) {
				headers.set(key, value)
			}
		}

		const abortController = new AbortController()
		this.requestControllers.add(abortController)
		const timeoutMs =
			typeof this.options.timeout === "number" && this.options.timeout > 0
				? this.options.timeout
				: undefined
		const body = serializeRequestBody(data, headers)

		let timeoutId: ReturnType<typeof setTimeout> | undefined
		if (timeoutMs !== undefined) {
			timeoutId = setTimeout(() => {
				abortController.abort()
			}, timeoutMs)
		}
		let response: Response
		const fetchFn = this.customFetch ?? fetch
		try {
			response = await fetchFn(url, {
				method,
				headers,
				body,
				signal: abortController.signal
			})
		} finally {
			if (timeoutId) {
				clearTimeout(timeoutId)
			}
			this.requestControllers.delete(abortController)
		}

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
			const rateLimitError = new RateLimitError(
				response,
				rateLimitBody,
				originalRequest
			)
			this.scheduleRateLimit(routeKey, path, rateLimitError)
			throw rateLimitError
		}

		this.updateBucketFromHeaders(routeKey, path, response)

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

	protected async waitForBucket(routeKey: string) {
		while (true) {
			const now = Date.now()
			if (this.globalRateLimitUntil > now) {
				await sleep(this.globalRateLimitUntil - now)
				continue
			}
			const bucketKey = this.routeBuckets.get(routeKey) ?? routeKey
			const bucket = this.bucketStates.get(bucketKey)
			if (bucket && bucket.delayUntil > now) {
				await sleep(bucket.delayUntil - now)
				continue
			}
			break
		}
	}

	protected scheduleRateLimit(
		routeKey: string,
		path: string,
		error: RateLimitError
	) {
		const bucketKey = error.bucket
			? this.getBucketKey(routeKey, path, error.bucket)
			: this.getCurrentBucketKey(routeKey)
		const waitTime = Math.max(0, Math.ceil(error.retryAfter * 1000))
		const now = Date.now()
		const bucket = this.bucketStates.get(bucketKey) ?? {
			delayUntil: 0,
			extraBackoff: 0,
			remaining: 0
		}
		const existingDelayPassed = bucket.delayUntil <= now
		const extraBackoff = existingDelayPassed
			? Math.min(bucket.extraBackoff ? bucket.extraBackoff * 2 : 1000, 60_000)
			: (bucket.extraBackoff ?? 0)
		const nextAvailable = now + waitTime + extraBackoff
		this.bucketStates.set(bucketKey, {
			delayUntil: nextAvailable,
			extraBackoff,
			remaining: 0
		})
		this.routeBuckets.set(routeKey, bucketKey)
		if (error.scope === "global") {
			this.globalRateLimitUntil = nextAvailable
		}
	}

	protected updateBucketFromHeaders(
		routeKey: string,
		path: string,
		response: Response
	) {
		const bucketId = response.headers.get("X-RateLimit-Bucket")
		const remainingRaw = response.headers.get("X-RateLimit-Remaining")
		const resetAfterRaw = response.headers.get("X-RateLimit-Reset-After")
		const hasInfo = !!bucketId || !!remainingRaw || !!resetAfterRaw
		if (!hasInfo) return

		const key = bucketId
			? this.getBucketKey(routeKey, path, bucketId)
			: this.getCurrentBucketKey(routeKey)
		if (bucketId) this.routeBuckets.set(routeKey, key)
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

	protected getCurrentBucketKey(routeKey: string) {
		return this.routeBuckets.get(routeKey) ?? routeKey
	}

	protected getBucketKey(
		routeKey: string,
		path: string,
		bucketId?: string | null
	) {
		if (!bucketId) return routeKey
		const major = this.getMajorParameter(path)
		return major ? `${bucketId}:${major}` : bucketId
	}

	protected getMajorParameter(path: string) {
		const segments = path.split("/")
		for (let index = 0; index < segments.length; index += 1) {
			const segment = segments[index]
			const prev = segments[index - 1]
			if (prev === "channels" || prev === "guilds") {
				return segment
			}
			if (prev === "webhooks") {
				const webhookToken = segments[index + 1]
				return webhookToken ? `${segment}/${webhookToken}` : segment
			}
		}
		return null
	}

	protected getRouteKey(method: string, path: string) {
		const segments = path.split("/")
		const normalized = segments
			.map((segment, index) => {
				if (!/^\d{16,}$/.test(segment)) return segment
				const prev = segments[index - 1]
				if (prev && ["channels", "guilds"].includes(prev)) {
					return segment
				}
				if (prev === "webhooks") {
					return segment
				}
				if (segments[index - 2] === "webhooks") {
					return segment
				}
				return ":id"
			})
			.join("/")
		return `${method}:${normalized}`
	}

	clearQueue() {
		this.scheduler.clear(new Error("Request queue cleared"))
	}

	get queueSize() {
		return this.scheduler.size
	}

	getSchedulerMetrics() {
		const schedulerMetrics = this.scheduler.getMetrics()
		return {
			queueSize: this.queueSize,
			activeWorkers: this.activeWorkers,
			maxConcurrentWorkers: this.maxConcurrentWorkers,
			...schedulerMetrics,
			globalRateLimitUntil: this.globalRateLimitUntil,
			activeBuckets: this.activeBucketKeys.size
		}
	}

	abortAllRequests() {
		for (const controller of this.requestControllers) {
			controller.abort()
		}
		this.requestControllers.clear()
		this.clearQueue()
	}
}

const sleep = (ms: number) =>
	new Promise((resolve) => setTimeout(resolve, Math.max(ms, 0)))
