---
title: GroupDmChannel
description: Represents a group DM channel.
hidden: true
---

## class `GroupDmChannel`

Represents a group DM channel.

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| getIconUrl | `(options: CDNUrlOptions) => IfPartial<IsPartial, string | null>` | Yes | Get the URL of the channel's icon with custom format and size options @param options Optional format and size parameters @returns The icon URL or null if no icon is set |
| setName | `(name: string) => void` | Yes | Set the name of the channel @param name The new name of the channel |
| send | `(message: MessagePayload) => void` | Yes | Send a message to the channel |
| triggerTyping | `() => void` | Yes | Trigger a typing indicator in the channel (this will expire after 10 seconds) |
