---
title: RequestClientOptions
description: The options used to initialize the RequestClient
hidden: true
---

## Signature

```ts
type RequestClientOptions = {
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
```


The options used to initialize the RequestClient

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| tokenHeader | `"Bot" | "Bearer"` | No | The header used to send the token in the request. This should generally always be "Bot" unless you are working with OAuth.  @default "Bot" |
| baseUrl | `string` | No | The base URL of the API. @default https://discord.com/api |
| apiVersion | `number` | No | The version of the API to use. @default 10 |
| userAgent | `string` | No | The user agent to use when making requests. @default DiscordBot (https://github.com/buape/carbon, v0.0.0) |
| timeout | `number` | No | The timeout for requests. @default 15000 |
| queueRequests | `boolean` | No | Whether or not to queue requests if you are rate limited. If this is true, requests will be queued and wait for the ratelimit to clear. If this is false, requests will be made immediately and will throw a RateLimitError if you are rate limited.  @default true |
| maxQueueSize | `number` | No | Legacy global max queue size. In lane-based scheduler mode this is used as fallback when lane-specific max queue sizes are not configured.  @default 1000 |
| runtimeProfile | `RuntimeProfile` | No | Runtime profile used to derive scheduler defaults.  @default "serverless" |
| scheduler | `RequestSchedulerOptions` | No | Scheduler controls for weighted fairness and backpressure. |
| fetch | `(
		input: string | URL | Request,
		init?: RequestInit
	) => Promise<Response>` | No | A custom fetch function to use for requests. This allows you to inject your own fetch implementation for proxy support, testing, mocking, or custom transport layers. |
