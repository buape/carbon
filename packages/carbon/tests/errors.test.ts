import { expect, test } from "vitest"

import { DiscordError, RateLimitError, errorMapper } from "../src/index.js"

test("Error Mapper", () => {
	// Example usage with Array Error type
	const arrayErrorData = {
		code: 50035,
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
		},
		message: "Invalid Form Body"
	}

	expect(errorMapper(arrayErrorData)).toEqual([
		{
			code: "BASE_TYPE_CHOICES",
			location: "activities.0.platform",
			message: "Value must be one of ('desktop', 'android', 'ios')."
		},
		{
			code: "BASE_TYPE_CHOICES",
			location: "activities.0.type",
			message: "Value must be one of (0, 1, 2, 3, 4, 5)."
		}
	])

	// Example usage with Object Error type
	const objectErrorData = {
		code: 50035,
		errors: {
			access_token: {
				_errors: [
					{
						code: "BASE_TYPE_REQUIRED",
						message: "This field is required"
					}
				]
			}
		},
		message: "Invalid Form Body"
	}

	expect(errorMapper(objectErrorData)).toEqual([
		{
			code: "BASE_TYPE_REQUIRED",
			location: "access_token",
			message: "This field is required"
		}
	])

	// Example usage with Request Error type
	const requestErrorData = {
		code: 50035,
		message: "Invalid Form Body",
		errors: {
			_errors: [
				{
					code: "APPLICATION_COMMAND_TOO_LARGE",
					message: "Command exceeds maximum size (8000)"
				}
			]
		}
	}

	expect(errorMapper(requestErrorData)).toEqual([
		{
			code: "APPLICATION_COMMAND_TOO_LARGE",
			location: "errors",
			message: "Command exceeds maximum size (8000)"
		}
	])
})

test("DiscordError", () => {
	const error = new DiscordError(
		new Response(null, {
			status: 400,
			statusText: "Bad Request",
			headers: {
				"Content-Type": "application/json",
				"X-RateLimit-Reset": "1679363420"
			}
		}),
		{
			code: 50035,
			message: "Invalid Form Body",
			errors: {
				_errors: [
					{
						code: "APPLICATION_COMMAND_TOO_LARGE",
						message: "Command exceeds maximum size (8000)"
					}
				]
			}
		}
	)

	expect(error.status).toBe(400)
	expect(error.discordCode).toBe(50035)
	expect(error.errors).toEqual([
		{
			code: "APPLICATION_COMMAND_TOO_LARGE",
			location: "errors",
			message: "Command exceeds maximum size (8000)"
		}
	])
})

test("RateLimitError", () => {
	const error = new RateLimitError(
		new Response(null, {
			status: 429,
			statusText: "Too Many Requests",
			headers: {
				"Content-Type": "application/json",
				"Retry-After": "64.57",
				"X-RateLimit-Global": "true",
				"X-RateLimit-Scope": "global"
			}
		}),
		{
			message: "You are being rate limited.",
			retry_after: 64.57,
			global: true
		}
	)

	expect(error.status).toBe(429)
	expect(error.discordCode).toBeUndefined()
	expect(error.errors).toEqual([])
	expect(error.retryAfter).toBe(64.57)
	expect(error.scope).toBe("global")
	expect(error.bucket).toBeNull()

	const error2 = new RateLimitError(
		new Response(null, {
			status: 429,
			statusText: "Too Many Requests",
			headers: {
				"Content-Type": "application/json",
				"Retry-After": "1337",
				"X-RateLimit-Limit": "10",
				"X-RateLimit-Remaining": "9",
				"X-RateLimit-Reset": "1470173023.123",
				"X-RateLimit-Reset-After": "64.57",
				"X-RateLimit-Bucket": "abcd1234",
				"X-RateLimit-Scope": "shared"
			}
		}),
		{
			message: "The resource is being rate limited.",
			retry_after: 1336.57,
			global: false
		}
	)

	expect(error2.status).toBe(429)
	expect(error2.discordCode).toBeUndefined()
	expect(error2.errors).toEqual([])
	expect(error2.retryAfter).toBe(1336.57)
	expect(error2.scope).toBe("shared")
	expect(error2.bucket).toBe("abcd1234")
})
