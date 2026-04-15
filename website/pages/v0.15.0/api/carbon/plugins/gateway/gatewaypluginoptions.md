---
title: GatewayPluginOptions
hidden: true
---

## interface `GatewayPluginOptions`

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| intents | `number` | Yes | The intents to use for the client |
| url | `string` | No | The URL of the gateway to connect to |
| shard | `[number, number]` | No | The shard to connect to [shard_id, num_shards] |
| reconnect | `{
		/**
		 * The maximum number of reconnect attempts
		 */
		maxAttempts?: number
		/**
		 * The base delay between reconnect attempts
		 */
		baseDelay?: number
		/**
		 * The maximum delay between reconnect attempts after it scales exponentially
		 */
		maxDelay?: number
	}` | No | The reconnect options |
| eventFilter | `(event: ListenerEventType) => boolean` | No | This is a custom function you can provide that will filter events. If this function is present, the plugin will only process events that return `true`. |
| autoInteractions | `boolean` | No | Whether the plugin should automatically handle interactions via the Gateway through Carbon. @default false |
| webSocketFactory | `(url: string) => GatewayWebSocketLike` | No | Optional WebSocket constructor/factory override. If omitted, Carbon will prefer Node's `ws` package when running on Node.js, and fall back to `globalThis.WebSocket` in browser-compatible runtimes. |
