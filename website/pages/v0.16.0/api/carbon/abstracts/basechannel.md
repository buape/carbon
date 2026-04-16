---
title: BaseChannel
hidden: true
---

## class `BaseChannel`

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| _rawData | `Extract<APIChannel, { type: Type }> | null` | Yes | The raw data of the channel. |
| _type | `Type | null` | Yes |  |
| setData | `(data: Extract<APIChannel, { type: Type }>) => void` | Yes |  |
| setField | `(field: keyof Extract<APIChannel, { type: Type }>, value: unknown) => void` | Yes |  |
| id | `string` | Yes | The id of the channel. |
| isDMBased | `() => this is Extract<this, DMBasedChannel<IsPartial>>` | Yes | Whether this is a DM-based channel. |
| isGuildBased | `() => this is Extract<this, GuildBasedChannel<IsPartial>>` | Yes | Whether this is a guild channel. |
| isThread | `() => this is Extract<this, ThreadChannel<IsPartial>>` | Yes | Whether this channel is a thread. |
| isThreadOnly | `() => this is Extract<this, ThreadOnlyChannel<IsPartial>>` | Yes | Whether this channel is thread-only (forum/media). |
| isSendable | `() => this is Extract<this, SendableChannel<IsPartial>>` | Yes | Whether this channel can be sent to directly. |
| fetch | `() => Promise<BaseChannel<Type, false>>` | Yes | Fetches the channel from the API. @returns A Promise that resolves to a non-partial channel |
| delete | `() => void` | Yes | Delete the channel |
| toString | `() => string` | Yes | Returns the Discord mention format for this channel @returns The mention string in the format <#channelId> |
