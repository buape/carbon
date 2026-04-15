---
title: BaseGuildChannel
hidden: true
---

## class `BaseGuildChannel`

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| rawData | `APIGuildChannel<Type> | null` | Yes |  |
| setName | `(name: string) => void` | Yes | Set the name of the channel @param name The new name of the channel |
| setParent | `(parent: GuildCategoryChannel | string) => void` | Yes | Set the parent ID of the channel @param parent The new category channel or ID to set |
| setNsfw | `(nsfw: boolean) => void` | Yes | Set whether the channel is nsfw @param nsfw The new nsfw status of the channel |
| send | `(message: MessagePayload) => void` | Yes | Send a message to the channel |
| getInvites | `() => void` | Yes | Get the invites for the channel |
| createInvite | `(options: RESTPostAPIChannelInviteJSONBody) => void` | Yes | Create an invite for the channel |
| triggerTyping | `() => void` | Yes | Trigger a typing indicator in the channel (this will expire after 10 seconds) |
