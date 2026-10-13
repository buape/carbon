---
title: Message
hidden: true
---

## class `Message`

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| _rawData | `APIMessage | null` | Yes |  |
| setData | `(data: typeof this._rawData) => void` | Yes |  |
| id | `MessageId` | Yes | The ID of the message |
| channelId | `ChannelId` | Yes | The ID of the channel the message is in |
| fetch | `(force: boolean) => Promise<Message<false>>` | Yes | Fetch updated data for this message. If cached data exists, this uses it unless force is true. @param force Whether to bypass cache and request fresh data from Discord @returns A Promise that resolves to a non-partial Message |
| delete | `() => void` | Yes | Delete this message from Discord |
| fetchChannel | `(force: boolean) => void` | Yes | Get the channel the message was sent in @param force Whether to bypass cache and request fresh data from Discord |
| pin | `() => void` | Yes | Pin this message |
| unpin | `() => void` | Yes | Unpin this message |
| startThread | `(data: RESTPostAPIChannelThreadsJSONBody) => void` | Yes | Start a thread with this message as the associated start message. If you want to start a thread without a start message, use {@link BaseGuildTextChannel.startThread} |
| edit | `(data: MessagePayload) => Promise<Message>` | Yes | Edit this message @param data - The data to edit the message with @returns A Promise that resolves to the edited message |
| forward | `(channelId: ChannelIdLike) => Promise<Message>` | Yes | Forward this message to a different channel @param channelId - The ID of the channel to forward the message to @returns A Promise that resolves to the forwarded message |
| reply | `(data: MessagePayload) => Promise<Message>` | Yes | Reply to this message @param data - The data to reply with @returns A Promise that resolves to the replied message |
| disableAllButtons | `() => void` | Yes | Disable all buttons on the message except for link buttons |
