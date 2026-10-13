---
title: RedisStreamGatewayForwarderPluginOptions
hidden: true
---

## interface `RedisStreamGatewayForwarderPluginOptions`

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| redis | `RedisStreamClient` | Yes | The ioredis client (or cluster client) to publish gateway events to. This connection is owned and managed by the caller. |
| streamKeyPrefix | `string` | No | Prefix used to derive the per-client stream key (`<prefix>:<clientId>`).  @default "carbon:events" |
| maxStreamLength | `number` | No | Approximate maximum stream length (`XADD ... MAXLEN ~ N`), used to bound unbounded stream growth. Set to `undefined` to disable trimming.  @default 100_000 |
| runtimeProfile | `RuntimeProfile` | No | Runtime profile that controls delivery defaults.  @default "serverless" |
| delivery | `RedisStreamDeliveryOptions` | No | Delivery policy for forwarded events. |
