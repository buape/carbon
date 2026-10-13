---
title: ShardingPluginOptions
hidden: true
---

## interface `ShardingPluginOptions`

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| totalShards | `number` | No | If not provided, will use Discord's recommended amount |
| shardIds | `number[]` | No | Specific shard IDs to spawn, if not provided will spawn all shards |
| maxConcurrency | `number` | No | Maximum number of shards to spawn concurrently |
