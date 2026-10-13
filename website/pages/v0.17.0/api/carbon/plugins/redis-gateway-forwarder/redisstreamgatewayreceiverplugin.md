---
title: RedisStreamGatewayReceiverPlugin
description: Receives gateway events from Redis Streams (one stream per client),
hidden: true
---

## class `RedisStreamGatewayReceiverPlugin`

Receives gateway events from Redis Streams (one stream per client),
multiplexed through a single blocking XREADGROUP loop shared across every
client `registerClient`s this plugin instance with. Meant to be
instantiated once and passed to a `ClientManager`'s shared `initialPlugins`
(the same pattern `SayPlugin`/`CommandDataPlugin` already rely on), so
`registerClient` is called once per tenant `Client`.

Errors are reported through the `onRegisterError`/`onDeliverError`/
`onBackpressure` callbacks, never by throwing. `registerClient` is called
by Carbon's `Client` constructor without being awaited (constructors can't
be async), and the read loop is a detached background task with no caller
either — a thrown error in either place would only surface as an unhandled
promise rejection (which can crash the process) rather than reach anything
that could catch it. The callbacks give the host application an explicit,
safe place to observe and log these failures instead.

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | `unknown` | Yes |  |
| options | `Required<
		Pick<
			RedisStreamGatewayReceiverPluginOptions,
			| "redis"
			| "blockingRedis"
			| "consumerGroup"
			| "consumerName"
			| "streamKeyPrefix"
			| "blockMs"
			| "batchCount"
			| "autoclaimIntervalMs"
			| "autoclaimMinIdleMs"
		>
	> &
		Pick<
			RedisStreamGatewayReceiverPluginOptions,
			| "onBackpressure"
			| "onDeliverError"
			| "onRegisterError"
			| "onDeliveryLatency"
		>` | Yes |  |
| watchedStreams | `unknown` | Yes |  |
| backoffUntil | `unknown` | Yes |  |
| backoffAttempt | `unknown` | Yes |  |
| loopRunning | `unknown` | Yes |  |
| stopRequested | `unknown` | Yes |  |
| lastAutoclaimAt | `unknown` | Yes |  |
| metrics | `unknown` | Yes |  |
| registerClient | `(client: Client) => Promise<void>` | Yes |  |
| detach | `(clientId: string) => void` | Yes | Stops watching a client's stream. Deliberately does not destroy the consumer group or delete the stream — a disabled-then-re-enabled client should resume from anything still pending, not lose it. |
| stop | `() => void` | Yes | Signals the read loop to stop after its current blocking call returns (up to `blockMs`). Does not touch the injected connections — the caller owns their lifecycle and can disconnect `blockingRedis` itself right after calling `stop()` for a faster shutdown. |
| getMetrics | `() => void` | Yes |  |
| bindCommand | `(client: RedisStreamClient, name: "xgroup" | "xack" | "xautoclaim" | "xreadgroup") => (...args: (string | number)[]) => Promise<unknown>` | Yes |  |
| isBackedOff | `(streamKey: string) => boolean` | Yes |  |
| setBackoff | `(streamKey: string) => void` | Yes |  |
| clearBackoff | `(streamKey: string) => void` | Yes |  |
| getBackoffWaitMs | `(streams: Array<{ streamKey: string }>) => number` | Yes | Milliseconds until the soonest backoff among `streams` clears, so a fully-backed-off loop iteration can sleep exactly that long instead of polling on a fixed interval. |
| runLoop | `() => Promise<void>` | Yes |  |
| drainPending | `(watched: Array<{ streamKey: string }>) => Promise<void>` | Yes |  |
| readNewEntries | `(watched: Array<{ streamKey: string }>) => Promise<void>` | Yes |  |
| processResult | `(result: [
			streamKey: string,
			entries: [id: string, fields: string[] | null][]
		][], { isReplay }: { isReplay: boolean }) => Promise<void>` | Yes |  |
| runAutoclaimSweep | `(watched: Array<{ streamKey: string }>) => Promise<void>` | Yes |  |
| ack | `(streamKey: string, id: string) => Promise<void>` | Yes |  |
