---
title: BabyCache
hidden: true
---

## class `BabyCache`

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| guildCache | `Map<string, GuildCacheEntry>` | Yes |  |
| maxGuilds | `number` | Yes |  |
| ttl | `number` | Yes |  |
| setGuild | `(guildId: GuildIdLike, entry: GuildCacheEntry) => void` | Yes |  |
| getGuild | `(guildId: GuildIdLike) => GuildCacheEntry | undefined` | Yes |  |
| removeGuild | `(guildId: GuildIdLike) => boolean` | Yes |  |
| cleanup | `() => number` | Yes |  |
