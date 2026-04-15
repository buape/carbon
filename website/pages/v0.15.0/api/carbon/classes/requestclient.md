---
title: RequestClient
description: This is the main class that handles making requests to the Discord API.
hidden: true
---

## class `RequestClient`

This is the main class that handles making requests to the Discord API.
It is used internally by Carbon, and you should not need to use it directly, but feel free to if you feel like living dangerously.

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| options | `RequestClientOptions` | Yes | The options used to initialize the client |
| token | `string` | Yes |  |
| customFetch | `| ((input: string | URL | Request, init?: RequestInit) => Promise<Response>)
		| undefined` | Yes |  |
| nextRequestId | `unknown` | Yes |  |
| wakeupTimer | `ReturnType<typeof setTimeout> | null` | Yes |  |
| wakeupDueAt | `number | null` | Yes |  |
| activeWorkers | `unknown` | Yes |  |
| activeBucketKeys | `unknown` | Yes |  |
| maxConcurrentWorkers | `unknown` | Yes |  |
| maxRateLimitRetries | `unknown` | Yes |  |
| scheduler | `RequestScheduler<ScheduledRequest>` | Yes |  |
| routeBuckets | `Map<string, string>` | Yes |  |
| bucketStates | `Map<
		string,
		{
			delayUntil: number
			extraBackoff: number
			remaining: number
		}
	>` | Yes |  |
| globalRateLimitUntil | `unknown` | Yes |  |
| requestControllers | `unknown` | Yes |  |
| get | `(path: string, query: QueuedRequest["query"]) => void` | Yes |  |
| post | `(path: string, data: RequestData, query: QueuedRequest["query"]) => void` | Yes |  |
| patch | `(path: string, data: RequestData, query: QueuedRequest["query"]) => void` | Yes |  |
| put | `(path: string, data: RequestData, query: QueuedRequest["query"]) => void` | Yes |  |
| delete | `(path: string, data: RequestData, query: QueuedRequest["query"]) => void` | Yes |  |
| configureScheduler | `() => void` | Yes |  |
| request | `(method: string, path: string, { data, query }: { data?: RequestData; query?: QueuedRequest["query"] }) => Promise<unknown>` | Yes |  |
| enqueueRequest | `(request: ScheduledRequest) => Error | null` | Yes |  |
| pumpQueue | `() => void` | Yes |  |
| runQueuedRequest | `(request: ScheduledRequest) => void` | Yes |  |
| takeNextReadyRequest | `() => void` | Yes |  |
| scheduleWakeup | `(waitMs: number) => void` | Yes |  |
| clearWakeupTimer | `() => void` | Yes |  |
| getRouteWaitTime | `(routeKey: string, now: unknown) => void` | Yes |  |
| getPriority | `(method: string, path: string) => RequestPriority` | Yes |  |
| executeRequest | `(request: ScheduledRequest) => Promise<unknown>` | Yes |  |
| waitForBucket | `(routeKey: string) => void` | Yes |  |
| scheduleRateLimit | `(routeKey: string, path: string, error: RateLimitError) => void` | Yes |  |
| updateBucketFromHeaders | `(routeKey: string, path: string, response: Response) => void` | Yes |  |
| getCurrentBucketKey | `(routeKey: string) => void` | Yes |  |
| getBucketKey | `(routeKey: string, path: string, bucketId: string | null) => void` | Yes |  |
| getMajorParameter | `(path: string) => void` | Yes |  |
| getRouteKey | `(method: string, path: string) => void` | Yes |  |
| clearQueue | `() => void` | Yes |  |
| getSchedulerMetrics | `() => void` | Yes |  |
| abortAllRequests | `() => void` | Yes |  |
