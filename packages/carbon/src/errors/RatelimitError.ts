import { DiscordError } from "./DiscordError.js"

/**
 * A RateLimitError is thrown when the bot is rate limited by Discord, and you don't have requests set to queue.
 */
export class RateLimitError extends DiscordError {
	retryAfter: number
	scope: "global" | "shared" | "user"
	bucket: string | null

	constructor(
		response: Response,
		body: {
			message: string
			retry_after: number
			global: boolean
		}
	) {
		super(response, body)
		if (this.status !== 429)
			throw new Error("Invalid status code for RateLimitError")
		this.retryAfter = body.retry_after
		this.scope = response.headers.get("X-RateLimit-Scope") as
			| "global"
			| "shared"
			| "user"
		this.bucket = response.headers.get("X-RateLimit-Bucket")
	}
}
