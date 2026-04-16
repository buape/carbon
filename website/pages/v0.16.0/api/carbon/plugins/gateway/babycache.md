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
| setGuild | `(guildId: string, entry: GuildCacheEntry) => void` | Yes |  |
| getGuild | `(guildId: string) => GuildCacheEntry | undefined` | Yes |  |
| removeGuild | `(guildId: string) => boolean` | Yes |  |
| cleanup | `() => number` | Yes |  |
