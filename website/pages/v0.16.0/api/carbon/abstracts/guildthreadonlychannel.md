---
title: GuildThreadOnlyChannel
hidden: true
---

## class `GuildThreadOnlyChannel`

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| rawData | `APIThreadOnlyChannel<Type> | null` | Yes |  |
| setPosition | `(position: number) => void` | Yes | Set the position of the channel @param position The new position of the channel |
| send | `() => Promise<never>` | Yes | You cannot send a message directly to a forum or media channel, so this method throws an error. Use {@link GuildThreadChannel.send} instead, or the alias {@link GuildThreadOnlyChannel.sendToPost} instead, to send a message to the channel's posts. |
| sendToPost | `(message: MessagePayload, postId: string) => Promise<Message>` | Yes | Send a message to a post in the channel @remarks This is an alias for {@link GuildThreadChannel.send} that will fetch the channel, but if you already have the channel, you can use {@link GuildThreadChannel.send} instead. |
| createPost | `(name: string, message: MessagePayload, options: {
			autoArchiveDuration?: number
			rateLimitPerUser?: number
			appliedTags?: string[]
		}) => Promise<GuildThreadChannel<ThreadChannelType>>` | Yes |  |
