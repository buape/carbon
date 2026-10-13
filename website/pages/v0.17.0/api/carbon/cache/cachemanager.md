---
title: CacheManager
hidden: true
---

## class `CacheManager`

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| enabled | `boolean` | Yes |  |
| users | `CacheNamespace<CachePayloadMap["users"]>` | Yes |  |
| guilds | `CacheNamespace<CachePayloadMap["guilds"]>` | Yes |  |
| channels | `CacheNamespace<CachePayloadMap["channels"]>` | Yes |  |
| roles | `CacheNamespace<CachePayloadMap["roles"]>` | Yes |  |
| members | `CacheNamespace<CachePayloadMap["members"]>` | Yes |  |
| messages | `CacheNamespace<CachePayloadMap["messages"]>` | Yes |  |
| emojis | `CacheNamespace<CachePayloadMap["emojis"]>` | Yes |  |
| scheduledEvents | `CacheNamespace<CachePayloadMap["scheduledEvents"]>` | Yes |  |
| emojiIdsByGuild | `unknown` | Yes |  |
| disabled | `() => void` | Yes |  |
| setEmoji | `(guildId: GuildIdLike, emoji: CachePayloadMap["emojis"]) => Promise<void>` | Yes |  |
| deleteEmoji | `(guildId: GuildIdLike, emojiId: EmojiIdLike) => Promise<void>` | Yes |  |
| handleGatewayEvent | `(type: T, data: ListenerEventRawData[T]) => void` | Yes |  |
| applyGatewayEvent | `(type: ListenerEventType, data: Record<string, unknown>) => void` | Yes |  |
| setById | `(namespace: CacheNamespace<T>, data: Record<string, unknown>) => void` | Yes |  |
| setGuildChildren | `(data: Record<string, unknown>) => void` | Yes |  |
| deleteById | `(namespace: CacheNamespace<T>, data: Record<string, unknown>) => void` | Yes |  |
| setMember | `(data: Record<string, unknown>) => void` | Yes |  |
| deleteMember | `(data: Record<string, unknown>) => void` | Yes |  |
| setMemberChunk | `(data: Record<string, unknown>) => void` | Yes |  |
| setRole | `(data: Record<string, unknown>) => void` | Yes |  |
| deleteRole | `(data: Record<string, unknown>) => void` | Yes |  |
| setEmojiList | `(data: Record<string, unknown>) => void` | Yes |  |
| trackEmoji | `(guildId: string, emojiId: string) => void` | Yes |  |
| setScheduledEvent | `(data: Record<string, unknown>) => void` | Yes |  |
| deleteScheduledEvent | `(data: Record<string, unknown>) => void` | Yes |  |
| setMessage | `(data: Record<string, unknown>) => void` | Yes |  |
| updateMessage | `(data: Record<string, unknown>) => void` | Yes |  |
| deleteMessage | `(data: Record<string, unknown>) => void` | Yes |  |
| deleteMessageBulk | `(data: Record<string, unknown>) => void` | Yes |  |
| resolveOptions | `(type: CacheType, options: CacheManagerOptions) => void` | Yes |  |
| resolveStore | `(type: CacheType, typeOptions: Required<CacheTypeOptions>, options: CacheManagerOptions) => void` | Yes |  |
