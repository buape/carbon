---
title: GatewayForwarderPlugin
hidden: true
---

## class `GatewayForwarderPlugin`

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | `unknown` | Yes |  |
| options | `GatewayForwarderPluginOptions` | Yes |  |
| privateKey | `ReturnType<typeof createPrivateKey>` | Yes |  |
| guildAvailabilityCache | `Map<string, boolean>` | Yes |  |
| deliveryPolicy | `Required<GatewayForwarderDeliveryOptions>` | Yes |  |
| deliveryExecutor | `ReturnType<
		typeof createBoundedExecutor<DeliveryTask>
	>` | Yes |  |
| forwardFetch | `| ((input: string | URL | Request, init?: RequestInit) => Promise<Response>)
		| undefined` | Yes |  |
| deliveryMetrics | `unknown` | Yes |  |
| failureReasons | `unknown` | Yes |  |
| setupWebSocket | `() => void` | Yes |  |
| getDeliveryMetrics | `() => void` | Yes |  |
| enqueueDelivery | `(task: DeliveryTask) => void` | Yes |  |
| deliver | `(task: DeliveryTask) => void` | Yes |  |
| sendWithTimeout | `(task: DeliveryTask, attempt: number) => void` | Yes |  |
| getRetryDelay | `(attempt: number) => void` | Yes |  |
| trackFailure | `(reason: string, eventType: string) => void` | Yes |  |
