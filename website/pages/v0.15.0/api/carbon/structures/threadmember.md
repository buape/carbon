---
title: ThreadMember
hidden: true
---

## class `ThreadMember`

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| _rawData | `APIThreadMember | null` | Yes |  |
| setData | `(data: typeof this._rawData) => void` | Yes |  |
| guildId | `string | undefined` | Yes | The ID of the guild. This is not present in the API response, so it must be provided. |
| member | `(guildId: string) => GuildMember<false, true> | undefined` | Yes | The member object of the user |
