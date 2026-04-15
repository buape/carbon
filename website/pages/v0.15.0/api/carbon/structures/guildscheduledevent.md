---
title: GuildScheduledEvent
hidden: true
---

## class `GuildScheduledEvent`

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| _rawData | `APIGuildScheduledEvent | null` | Yes |  |
| setData | `(data: typeof this._rawData) => void` | Yes |  |
| id | `string` | Yes | The ID of the scheduled event |
| guildId | `string` | Yes | The ID of the guild this scheduled event belongs to |
| fetch | `() => Promise<GuildScheduledEvent<false>>` | Yes | Fetch updated data for this scheduled event. If the scheduled event is partial, this will fetch all the data for the scheduled event and populate the fields. If the scheduled event is not partial, all fields will be updated with new values from Discord. @returns A Promise that resolves to a non-partial GuildScheduledEvent |
| edit | `(data: Partial<GuildScheduledEventCreateData>) => Promise<GuildScheduledEvent<false>>` | Yes | Edit the scheduled event @param data The data to update the scheduled event with @returns A Promise that resolves to the updated scheduled event |
| delete | `() => Promise<void>` | Yes | Delete the scheduled event |
| getGuild | `() => Promise<Guild<false>>` | Yes | Get the guild this scheduled event belongs to |
| fetchUsers | `(options: Omit<RESTGetAPIGuildScheduledEventUsersQuery, "with_member">) => void` | Yes | Fetch the users subscribed to this scheduled event @param options The options for fetching the users @returns A Promise that resolves to an array of Users |
