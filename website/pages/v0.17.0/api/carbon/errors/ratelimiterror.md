---
title: RateLimitError
description: A RateLimitError is thrown when the bot is rate limited by Discord, and you don't have requests set to queue.
hidden: true
---

## class `RateLimitError`

A RateLimitError is thrown when the bot is rate limited by Discord, and you don't have requests set to queue.

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| retryAfter | `number` | Yes | Number of seconds to wait before submitting another request. |
| global | `boolean` | Yes | Whether Discord says this is a global rate limit. |
| scope | `"global" | "shared" | "user"` | Yes | The Discord rate-limit scope from `X-RateLimit-Scope`. |
| bucket | `string | null` | Yes | The Discord rate-limit bucket from `X-RateLimit-Bucket`. |
| limit | `number | null` | Yes | The request limit from `X-RateLimit-Limit`. |
| remaining | `number | null` | Yes | Remaining requests from `X-RateLimit-Remaining`. |
| reset | `number | null` | Yes | Reset epoch time from `X-RateLimit-Reset`. |
| resetAfter | `number | null` | Yes | Reset duration in seconds from `X-RateLimit-Reset-After`. |
| request | `Request` | Yes | The request that hit the rate limit. |
| method | `string` | Yes | The HTTP method that hit the rate limit. |
| url | `string` | Yes | The URL that hit the rate limit. |
| toJSON | `() => void` | Yes |  |
| formatRateLimitMessage | `(response: Response, body: {
			message: string
			retry_after: number
			global: boolean
			code?: number
		}, request: Request) => void` | Yes |  |
| getScope | `(response: Response, body: {
			global: boolean
		}) => void` | Yes |  |
| getNumericHeader | `(response: Response, header: string) => void` | Yes |  |
