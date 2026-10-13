---
title: GuildThreadChannel
hidden: true
---

## class `GuildThreadChannel`

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| rawData | `BrandedDiscordIds<APIThreadChannel, ChannelId> | null` | Yes |  |
| join | `() => void` | Yes | Join the thread |
| addMember | `(userId: UserIdLike | "@me") => void` | Yes | Add a member to the thread |
| leave | `() => void` | Yes | Leave the thread |
| removeMember | `(userId: UserIdLike | "@me") => void` | Yes | Get the pinned messages in the thread |
| archive | `() => void` | Yes | Archive the thread |
| unarchive | `() => void` | Yes | Unarchive the thread |
| setAutoArchiveDuration | `(duration: number) => void` | Yes | Set the auto archive duration of the thread |
| lock | `() => void` | Yes | Lock the thread |
| unlock | `() => void` | Yes | Unlock the thread |
