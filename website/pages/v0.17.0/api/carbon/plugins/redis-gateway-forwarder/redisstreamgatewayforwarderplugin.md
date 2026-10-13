---
title: RedisStreamGatewayForwarderPlugin
description: Forwards gateway events to a Redis Stream (one stream per client) instead of
hidden: true
---

## class `RedisStreamGatewayForwarderPlugin`

Forwards gateway events to a Redis Stream (one stream per client) instead of
a signed HTTP webhook. Intended for trusted, internal delivery between a
gateway-connected forwarder process and a processor that consumes the
stream with `RedisStreamGatewayReceiverPlugin`.

Delivery and message-parsing failures are reported through the inherited
`emitter`'s `"error"` event (the same channel `GatewayPlugin` already uses
for websocket-level errors), not by throwing. Both failure paths happen
inside a websocket message handler and a background bounded-executor retry
loop — neither is awaited by anything, so a thrown error there would only
become an unhandled promise rejection instead of reaching a caller.
Subscribe with `plugin.emitter.on("error", (error) => ...)`, exactly how
`ForwarderRuntime.attachForwarderErrorHandler` already does for the base
gateway connection.

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | `unknown` | Yes |  |
| options | `RedisStreamGatewayForwarderPluginOptions` | Yes |  |
| streamKey | `string` | No |  |
| guildAvailabilityCache | `Map<string, boolean>` | Yes |  |
| deliveryPolicy | `Required<RedisStreamDeliveryOptions>` | Yes |  |
| deliveryExecutor | `ReturnType<
		typeof createBoundedExecutor<DeliveryTask>
	>` | Yes |  |
| deliveryMetrics | `unknown` | Yes |  |
| failureReasons | `unknown` | Yes |  |
| registerClient | `(client: Client) => Promise<void>` | Yes |  |
| setupWebSocket | `() => void` | Yes |  |
| getDeliveryMetrics | `() => void` | Yes |  |
| enqueueDelivery | `(task: DeliveryTask) => void` | Yes |  |
| deliver | `(task: DeliveryTask) => void` | Yes |  |
| sendWithTimeout | `(task: DeliveryTask) => void` | Yes |  |
| getRetryDelay | `(attempt: number) => void` | Yes |  |
| trackFailure | `(reason: string, eventType: string) => void` | Yes |  |
