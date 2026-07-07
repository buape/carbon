---
"@buape/carbon": minor
---

feat: add Redis Streams gateway forwarder/receiver plugins

New `@buape/carbon/redis-gateway-forwarder` module with `RedisStreamGatewayForwarderPlugin` / `ShardedRedisStreamGatewayForwarderPlugin` (sender) and `RedisStreamGatewayReceiverPlugin` (receiver). This is an alternative to `GatewayForwarderPlugin`'s HTTP webhook for forwarding gateway events. Delivers via one Redis Stream per client.

Delivery/registration errors are reported through `onDeliveryLatency`/`onDeliverError`/`onRegisterError`/`onBackpressure` callbacks (receiver) and the emitter`'s `"error"` event (sender).
