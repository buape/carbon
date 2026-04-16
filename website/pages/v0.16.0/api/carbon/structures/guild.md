---
title: Guild
hidden: true
---

## class `Guild`

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| _rawData | `APIGuild | null` | Yes |  |
| setData | `(data: typeof this._rawData) => void` | Yes |  |
| setField | `(key: keyof APIGuild, value: unknown) => void` | Yes |  |
| id | `string` | Yes | The ID of the guild |
| getIconUrl | `(options: CDNUrlOptions) => IfPartial<IsPartial, string | null>` | Yes | Get the URL of the guild's icon with custom format and size options @param options Optional format and size parameters @returns The icon URL or null if no icon is set |
| getSplashUrl | `(options: CDNUrlOptions) => IfPartial<IsPartial, string | null>` | Yes | Get the URL of the guild's splash with custom format and size options @param options Optional format and size parameters @returns The splash URL or null if no splash is set |
| getDiscoverySplashUrl | `(options: CDNUrlOptions) => IfPartial<IsPartial, string | null>` | Yes | Get the URL of the guild's discovery splash with custom format and size options @param options Optional format and size parameters @returns The discovery splash URL or null if no discovery splash is set |
| getBannerUrl | `(options: CDNUrlOptions) => IfPartial<IsPartial, string | null>` | Yes | Get the URL of the guild's banner with custom format and size options @param options Optional format and size parameters @returns The banner URL or null if no banner is set |
| fetch | `() => Promise<Guild<false>>` | Yes | Fetch updated data for this guild. If the guild is partial, this will fetch all the data for the guild and populate the fields. If the guild is not partial, all fields will be updated with new values from Discord. @returns A Promise that resolves to a non-partial Guild |
| leave | `() => void` | Yes | Leave the guild |
| createChannel | `(data: Omit<RESTPostAPIGuildChannelJSONBody, "type"> & { type: T }) => Promise<ChannelTypeMap[T]>` | Yes | Create a channel in the guild |
| createChannel | `(data: Omit<RESTPostAPIGuildChannelJSONBody, "type"> & { type?: undefined }) => Promise<ChannelTypeMap[ChannelType.GuildText]>` | Yes |  |
| createChannel | `(data: RESTPostAPIGuildChannelJSONBody) => Promise<AnyChannel>` | Yes |  |
| createRole | `(data: RESTPostAPIGuildRoleJSONBody) => void` | Yes | Create a role in the guild |
| fetchMember | `(memberId: string) => Promise<GuildMember<false, true> | null>` | Yes | Get a member in the guild by ID @param memberId The ID of the member to fetch @returns A Promise that resolves to a GuildMember or null if not found |
| fetchMembers | `(limit: number | "all") => Promise<GuildMember<false, IsPartial>[]>` | Yes | Fetch all members in the guild @param limit The maximum number of members to fetch (max 1000, default 100, set to "all" to fetch all members) @returns A Promise that resolves to an array of GuildMember objects @experimental |
| fetchChannel | `(channelId: string) => void` | Yes | Fetch a channel from the guild by ID |
| fetchChannels | `() => Promise<AnyChannel[]>` | Yes | Fetch all channels in the guild @returns A Promise that resolves to an array of channel objects |
| fetchRole | `(roleId: string) => void` | Yes | Fetch a role from the guild by ID |
| fetchRoles | `() => Promise<Role[]>` | Yes | Fetch all roles in the guild @returns A Promise that resolves to an array of Role objects |
| getEmoji | `(id: string) => Promise<GuildEmoji>` | Yes |  |
| getEmojiByName | `(name: string) => GuildEmoji | undefined` | Yes |  |
| createEmoji | `(name: string, image: string) => void` | Yes | Upload a new emoji to the application @param name The name of the emoji @param image The image of the emoji in base64 format @returns The created ApplicationEmoji |
| deleteEmoji | `(id: string) => void` | Yes |  |
| fetchScheduledEvents | `(withUserCount: unknown) => Promise<GuildScheduledEvent<false>[]>` | Yes | Fetch all scheduled events for the guild @param withUserCount Whether to include the user count in the response @returns A Promise that resolves to an array of GuildScheduledEvent objects |
| fetchScheduledEvent | `(eventId: string, withUserCount: unknown) => Promise<GuildScheduledEvent<false> | null>` | Yes | Fetch a specific scheduled event by ID @param eventId The ID of the scheduled event to fetch @param withUserCount Whether to include the user count in the response @returns A Promise that resolves to a GuildScheduledEvent or null if not found |
| createScheduledEvent | `(data: GuildScheduledEventCreateData) => Promise<GuildScheduledEvent<false>>` | Yes | Create a new scheduled event @param data The data for the scheduled event @returns A Promise that resolves to the created GuildScheduledEvent |
| editScheduledEvent | `(eventId: string, data: Partial<GuildScheduledEventCreateData>) => Promise<GuildScheduledEvent<false>>` | Yes | Edit a scheduled event @param eventId The ID of the scheduled event to edit @param data The data to update the scheduled event with @returns A Promise that resolves to the updated GuildScheduledEvent |
| deleteScheduledEvent | `(eventId: string) => Promise<void>` | Yes | Delete a scheduled event @param eventId The ID of the scheduled event to delete |
| fetchRoleMemberCounts | `() => Promise<
		Array<{ id: string; role: Role<true>; count: number }>
	>` | Yes | Get member counts for each role in the guild @returns A Promise that resolves to an array of objects containing role ID, partial Role, and member count |
