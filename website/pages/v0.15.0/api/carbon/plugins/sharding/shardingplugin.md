---
title: ShardingPlugin
hidden: true
---

## class `ShardingPlugin`

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | `unknown` | Yes |  |
| client | `Client` | No |  |
| shards | `Map<number, GatewayPlugin>` | Yes |  |
| config | `ShardingPluginOptions` | Yes |  |
| maxConcurrency | `number` | Yes |  |
| spawnQueue | `number[]` | Yes |  |
| spawning | `unknown` | Yes |  |
| gatewayInfo | `APIGatewayBotInfo` | No |  |
| customGatewayPlugin | `unknown` | Yes |  |
| registerClient | `(client: Client) => Promise<void>` | Yes |  |
| processSpawnQueue | `() => Promise<void>` | Yes |  |
| disconnect | `() => void` | Yes |  |
| getShardForGuild | `(guildId: string) => GatewayPlugin | undefined` | Yes | Calculate which shard a guild belongs to |
| calculateShardId | `(guildId: string, totalShards: number) => number` | Yes | Discord's sharding formula |
