---
title: GuildAnnouncementChannel
description: Represents a guild announcement channel.
hidden: true
---

## class `GuildAnnouncementChannel`

Represents a guild announcement channel.

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| rawData | `APIGuildTextChannel<ChannelType.GuildAnnouncement> | null` | Yes |  |
| setPosition | `(position: number) => void` | Yes | Set the position of the channel @param position The new position of the channel |
| follow | `(targetChannel: GuildTextChannel | string) => void` | Yes |  |
