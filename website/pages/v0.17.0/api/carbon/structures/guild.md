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
| id | `GuildId` | Yes | The ID of the guild |
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
| fetchMember | `(memberId: UserIdLike, force: boolean) => Promise<GuildMember<false, true> | null>` | Yes | Get a member in the guild by ID @param memberId The ID of the member to fetch @param force Whether to bypass cache and request fresh data from Discord @returns A Promise that resolves to a GuildMember or null if not found |
| fetchMembers | `(limit: number | "all") => Promise<GuildMember<false, IsPartial>[]>` | Yes | Fetch all members in the guild @param limit The maximum number of members to fetch (max 1000, default 100, set to "all" to fetch all members) @returns A Promise that resolves to an array of GuildMember objects @experimental |
| pruneMembers | `(options: {
			/** Number of days of inactivity to prune for (1-30). Defaults to 7. */
			days?: RESTPostAPIGuildPruneJSONBody["days"]
			/** Whether Discord should return the prune count. Defaults to true. */
			computePruneCount?: RESTPostAPIGuildPruneJSONBody["compute_prune_count"]
			/** Role IDs to include in the prune. */
			includeRoles?: RESTPostAPIGuildPruneJSONBody["include_roles"]
			/** Reason shown in the guild audit log. */
			reason?: string
		}) => Promise<RESTPostAPIGuildPruneResult["pruned"]>` | Yes | Begin a guild prune operation.  @remarks By default, Discord does not prune members with roles. Use `includeRoles` to include inactive members whose roles are a subset of the provided roles.  @param options Prune options @returns The number of pruned members, or `null` when `computePruneCount` is `false` |
| fetchChannel | `(channelId: ChannelIdLike, force: boolean) => void` | Yes | Fetch a channel from the guild by ID @param channelId The ID of the channel to fetch @param force Whether to bypass cache and request fresh data from Discord |
| fetchChannels | `() => Promise<AnyChannel[]>` | Yes | Fetch all channels in the guild @returns A Promise that resolves to an array of channel objects |
| searchMessages | `(options: RESTGetAPIGuildMessagesSearchQuery) => Promise<
		| Extract<RESTGetAPIGuildMessagesSearchResult, { message: string }>
		| (Omit<
				Extract<RESTGetAPIGuildMessagesSearchResult, { messages: unknown }>,
				"messages" | "threads" | "members"
		  > & {
				messages: Message<false>[][]
				threads?: GuildThreadChannel<ThreadChannelType>[]
				members?: ThreadMember[]
				raw: Pick<
					Extract<RESTGetAPIGuildMessagesSearchResult, { messages: unknown }>,
					"threads" | "members"
				>
		  })
	>` | Yes | Search for messages in the guild.  @remarks The Search Guild Messages endpoint is restricted according to whether the MESSAGE_CONTENT Privileged Intent is enabled for your application.  If the entity you are searching is not yet indexed, the endpoint will return a 202 accepted response. The response body will not contain any search results, and will look similar to an error response: ```json {   "message": "Index not yet available. Try again later",   "code": 110000,   "documents_indexed": 0,   "retry_after": 2 } ```  @param options Search filters and pagination options |
| fetchRole | `(roleId: RoleIdLike, force: boolean) => void` | Yes | Fetch a role from the guild by ID @param roleId The ID of the role to fetch @param force Whether to bypass cache and request fresh data from Discord |
| fetchRoles | `() => Promise<Role[]>` | Yes | Fetch all roles in the guild @returns A Promise that resolves to an array of Role objects |
| getEmoji | `(id: EmojiIdLike, force: boolean) => Promise<GuildEmoji>` | Yes |  |
| getEmojiByName | `(name: string) => GuildEmoji | undefined` | Yes |  |
| createEmoji | `(name: string, image: string) => void` | Yes | Upload a new emoji to the application @param name The name of the emoji @param image The image of the emoji in base64 format @returns The created ApplicationEmoji |
| deleteEmoji | `(id: EmojiIdLike) => void` | Yes |  |
| fetchScheduledEvents | `(withUserCount: unknown) => Promise<GuildScheduledEvent<false>[]>` | Yes | Fetch all scheduled events for the guild @param withUserCount Whether to include the user count in the response @returns A Promise that resolves to an array of GuildScheduledEvent objects |
| fetchScheduledEvent | `(eventId: GuildScheduledEventIdLike, withUserCount: unknown, force: boolean) => Promise<GuildScheduledEvent<false> | null>` | Yes | Fetch a specific scheduled event by ID @param eventId The ID of the scheduled event to fetch @param withUserCount Whether to include the user count in the response @param force Whether to bypass cache and request fresh data from Discord @returns A Promise that resolves to a GuildScheduledEvent or null if not found |
| createScheduledEvent | `(data: GuildScheduledEventCreateData) => Promise<GuildScheduledEvent<false>>` | Yes | Create a new scheduled event @param data The data for the scheduled event @returns A Promise that resolves to the created GuildScheduledEvent |
| editScheduledEvent | `(eventId: GuildScheduledEventIdLike, data: Partial<GuildScheduledEventCreateData>) => Promise<GuildScheduledEvent<false>>` | Yes | Edit a scheduled event @param eventId The ID of the scheduled event to edit @param data The data to update the scheduled event with @returns A Promise that resolves to the updated GuildScheduledEvent |
| deleteScheduledEvent | `(eventId: GuildScheduledEventIdLike) => Promise<void>` | Yes | Delete a scheduled event @param eventId The ID of the scheduled event to delete |
| fetchRoleMemberCounts | `() => Promise<
		Array<{ id: RoleId; role: Role<true>; count: number }>
	>` | Yes | Get member counts for each role in the guild @returns A Promise that resolves to an array of objects containing role ID, partial Role, and member count |
