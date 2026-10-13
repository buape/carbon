---
title: VoicePlugin
hidden: true
---

## class `VoicePlugin`

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | `unknown` | Yes |  |
| client | `Client` | No |  |
| adapters | `Map<string, DiscordGatewayAdapterLibraryMethods>` | Yes |  |
| shardingPlugin | `ShardingPlugin` | No |  |
| gatewayPlugin | `GatewayPlugin` | No |  |
| registerClient | `(client: Client) => Promise<void>` | Yes |  |
| getGateway | `(guild_id: GuildIdLike) => void` | Yes |  |
| getGatewayAdapterCreator | `(guild_id: GuildIdLike) => DiscordGatewayAdapterCreator` | Yes |  |
