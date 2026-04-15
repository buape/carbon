---
title: DmChannel
description: Represents a DM between two users.
hidden: true
---

## class `DmChannel`

Represents a DM between two users.

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| send | `(message: MessagePayload) => void` | Yes | Send a message to the channel |
| triggerTyping | `() => void` | Yes | Trigger a typing indicator in the channel (this will expire after 10 seconds) |
