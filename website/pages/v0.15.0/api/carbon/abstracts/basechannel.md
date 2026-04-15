---
title: BaseChannel
hidden: true
---

## class `BaseChannel`

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| _rawData | `Extract<APIChannel, { type: Type }> | null` | Yes | The raw data of the channel. |
| setData | `(data: Extract<APIChannel, { type: Type }>) => void` | Yes |  |
| setField | `(field: keyof Extract<APIChannel, { type: Type }>, value: unknown) => void` | Yes |  |
| id | `string` | Yes | The id of the channel. |
| fetch | `() => Promise<BaseChannel<Type, false>>` | Yes | Fetches the channel from the API. @returns A Promise that resolves to a non-partial channel |
| delete | `() => void` | Yes | Delete the channel |
| toString | `() => string` | Yes | Returns the Discord mention format for this channel @returns The mention string in the format <#channelId> |
