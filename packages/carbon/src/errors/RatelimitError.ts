import { DiscordError } from "./DiscordError.js"

/**
 * A RateLimitError is thrown when the bot is rate limited by Discord, and you don't have requests set to queue.
 */
export class RateLimitError extends DiscordError {
	/**
	 * Number of seconds to wait before submitting another request.
	 */
	retryAfter: number
	/**
	 * Whether Discord says this is a global rate limit.
	 */
	global: boolean
	/**
	 * The Discord rate-limit scope from `X-RateLimit-Scope`.
	 */
	scope: "global" | "shared" | "user"
	/**
	 * The Discord rate-limit bucket from `X-RateLimit-Bucket`.
	 */
	bucket: string | null
	/**
	 * The request limit from `X-RateLimit-Limit`.
	 */
	limit: number | null
	/**
	 * Remaining requests from `X-RateLimit-Remaining`.
	 */
	remaining: number | null
	/**
	 * Reset epoch time from `X-RateLimit-Reset`.
	 */
	reset: number | null
	/**
	 * Reset duration in seconds from `X-RateLimit-Reset-After`.
	 */
	resetAfter: number | null
	/**
	 * The request that hit the rate limit.
	 */
	request!: Request
	/**
	 * The HTTP method that hit the rate limit.
	 */
	method: string
	/**
	 * The URL that hit the rate limit.
	 */
	url: string

	constructor(
		response: Response,
		body: {
			message: string
			retry_after: number
			global: boolean
			code?: number
		},
		request: Request
	) {
		const scope = RateLimitError.getScope(response, body)
		const bucket = response.headers.get("X-RateLimit-Bucket")
		super(
			response,
			body,
			RateLimitError.formatRateLimitMessage(response, body, request)
		)
		if (this.status !== 429)
			throw new Error("Invalid status code for RateLimitError")
		this.retryAfter = body.retry_after
		this.global = body.global
		this.scope = scope
		this.bucket = bucket
		this.limit = RateLimitError.getNumericHeader(response, "X-RateLimit-Limit")
		this.remaining = RateLimitError.getNumericHeader(
			response,
			"X-RateLimit-Remaining"
		)
		this.reset = RateLimitError.getNumericHeader(response, "X-RateLimit-Reset")
		this.resetAfter = RateLimitError.getNumericHeader(
			response,
			"X-RateLimit-Reset-After"
		)
		Object.defineProperty(this, "request", {
			value: request,
			enumerable: false,
			writable: true,
			configurable: true
		})
		this.method = request.method
		this.url = request.url
	}

	toJSON() {
		return {
			...super.toJSON(),
			retryAfter: this.retryAfter,
			global: this.global,
			scope: this.scope,
			bucket: this.bucket,
			limit: this.limit,
			remaining: this.remaining,
			reset: this.reset,
			resetAfter: this.resetAfter,
			method: this.method,
			url: this.url
		}
	}

	private static formatRateLimitMessage(
		response: Response,
		body: {
			message: string
			retry_after: number
			global: boolean
			code?: number
		},
		request: Request
	) {
		const status = response.statusText
			? `${response.status} ${response.statusText}`
			: `${response.status}`
		const code = body.code === undefined ? "" : `, Discord code ${body.code}`
		const scope = RateLimitError.getScope(response, body)
		const bucket = response.headers.get("X-RateLimit-Bucket")
		const bucketDetail = bucket ? `, bucket ${bucket}` : ""

		return `${body.message} (${status}${code}, retry after ${body.retry_after}s, scope ${scope}, global ${body.global}${bucketDetail}, ${request.method} ${request.url})`
	}

	private static getScope(
		response: Response,
		body: {
			global: boolean
		}
	) {
		const scope = response.headers.get("X-RateLimit-Scope")
		if (scope === "global" || scope === "shared" || scope === "user") {
			return scope
		}
		return body.global ? "global" : "user"
	}

	private static getNumericHeader(response: Response, header: string) {
		const value = response.headers.get(header)
		if (value === null) return null
		const numericValue = Number(value)
		return Number.isNaN(numericValue) ? null : numericValue
	}
}
