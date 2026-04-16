---
title: GuildCategoryChannel
description: Represents a guild category channel.
hidden: true
---

## class `GuildCategoryChannel`

Represents a guild category channel.

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| rawData | `APIGuildCategoryChannel | null` | Yes |  |
| setPosition | `(position: number) => void` | Yes | Set the position of the channel @param position The new position of the channel |
| send | `() => Promise<never>` | Yes | You cannot send a message to a category channel, so this method throws an error |
