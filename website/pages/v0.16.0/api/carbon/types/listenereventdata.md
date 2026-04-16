---
title: ListenerEventData
hidden: true
---

## Signature

```ts
type ListenerEventData = {
	[ListenerEvent.GuildAvailable]: Omit<
		GatewayGuildCreateDispatchData,
		"guild"
	> & {
		guild: Guild
	}
	[ListenerEvent.GuildUnavailable]: Omit<
		GatewayGuildDeleteDispatchData,
		"guild"
	> & {
		guild: Guild<true>
	}
	[ListenerEvent.ApplicationAuthorized]: Omit<
		APIWebhookEventApplicationAuthorizedData,
		"guild" | "user"
	> & {
		guild?: Guild
		user: User
		rawGuild: APIWebhookEventApplicationAuthorizedData["guild"]
		rawUser: APIWebhookEventApplicationAuthorizedData["user"]
	}
	[ListenerEvent.ApplicationDeauthorized]: Omit<
		APIWebhookEventApplicationDeauthorizedData,
		"user"
	> & {
		user: User
		rawUser: APIWebhookEventApplicationDeauthorizedData["user"]
	}
	[ListenerEvent.EntitlementCreate]: Omit<
		APIWebhookEventEntitlementCreateData,
		"guild" | "user"
	> & {
		guild?: Guild<true>
		user?: User<true>
	}
	[ListenerEvent.QuestUserEnrollment]: APIWebhookEventQuestUserEnrollmentData
	[ListenerEvent.ApplicationCommandPermissionsUpdate]: Omit<
		GatewayApplicationCommandPermissionsUpdateDispatchData,
		"guild"
	> & {
		guild: Guild<true>
	}
	[ListenerEvent.AutoModerationActionExecution]: Omit<
		GatewayAutoModerationActionExecutionDispatchData,
		"guild" | "user" | "message"
	> & {
		guild: Guild<true>
		user: User<true>
		message?: Message<true>
	}
	[ListenerEvent.AutoModerationRuleCreate]: Omit<
		GatewayAutoModerationRuleCreateDispatchData,
		"guild" | "creator"
	> & {
		guild: Guild<true>
		creator: User<true>
	}
	[ListenerEvent.AutoModerationRuleDelete]: Omit<
		GatewayAutoModerationRuleDeleteDispatchData,
		"guild" | "creator"
	> & {
		guild: Guild<true>
		creator: User<true>
	}
	[ListenerEvent.AutoModerationRuleUpdate]: Omit<
		GatewayAutoModerationRuleUpdateDispatchData,
		"guild" | "creator"
	> & {
		guild: Guild<true>
		creator: User<true>
	}
	[ListenerEvent.ChannelCreate]: Omit<
		GatewayChannelCreateDispatchData,
		"channel"
	> & {
		channel?: AnyChannel
		rawChannel: GatewayChannelCreateDispatchData
	}
	[ListenerEvent.ChannelDelete]: Omit<
		GatewayChannelDeleteDispatchData,
		"channel"
	> & {
		channel?: AnyChannel
		rawChannel: GatewayChannelDeleteDispatchData
	}
	[ListenerEvent.ChannelPinsUpdate]: Omit<
		GatewayChannelPinsUpdateDispatchData,
		"guild" | "channel"
	> & {
		guild?: Guild<true>
		channel?: AnyChannel<true>
	}
	[ListenerEvent.ChannelUpdate]: Omit<
		GatewayChannelUpdateDispatchData,
		"channel"
	> & {
		channel?: AnyChannel
		rawChannel: GatewayChannelUpdateDispatchData
	}
	[ListenerEvent.EntitlementDelete]: GatewayEntitlementDeleteDispatchData & {
		guild?: Guild<true>
		user?: User<true>
	}
	[ListenerEvent.EntitlementUpdate]: GatewayEntitlementUpdateDispatchData & {
		guild?: Guild<true>
		user?: User<true>
	}
	[ListenerEvent.GuildAuditLogEntryCreate]: GatewayGuildAuditLogEntryCreateDispatchData & {
		guild: Guild<true>
		user: User<true>
		target?: User<true>
	}
	[ListenerEvent.GuildBanAdd]: Omit<GatewayGuildBanAddDispatchData, "user"> & {
		guild: Guild<true>
		rawUser: GatewayGuildBanAddDispatchData["user"]
		user: User<false>
	}
	[ListenerEvent.GuildBanRemove]: Omit<
		GatewayGuildBanRemoveDispatchData,
		"user"
	> & {
		guild: Guild<true>
		rawUser: GatewayGuildBanRemoveDispatchData["user"]
		user: User<false>
	}
	[ListenerEvent.GuildCreate]: Omit<GatewayGuildCreateDispatchData, "guild"> & {
		guild: Guild
	}
	[ListenerEvent.GuildDelete]: Omit<GatewayGuildDeleteDispatchData, "guild"> & {
		guild: Guild<true>
	}
	[ListenerEvent.GuildEmojisUpdate]: GatewayGuildEmojisUpdateDispatchData & {
		guild: Guild<true>
	}
	[ListenerEvent.GuildIntegrationsUpdate]: GatewayGuildIntegrationsUpdateDispatchData & {
		guild: Guild<true>
	}
	[ListenerEvent.GuildMemberAdd]: Omit<
		GatewayGuildMemberAddDispatchData,
		"guild" | "member"
	> & {
		guild: Guild<true>
		member: GuildMember<false, true>
	}
	[ListenerEvent.GuildMemberRemove]: Omit<
		GatewayGuildMemberRemoveDispatchData,
		"user"
	> & {
		guild: Guild<true>
		user: User<false>
		rawUser: GatewayGuildMemberRemoveDispatchData["user"]
	}
	[ListenerEvent.GuildMemberUpdate]: Omit<
		GatewayGuildMemberUpdateDispatchData,
		"member"
	> & {
		guild: Guild<true>
		member: GuildMember<false, true>
		rawMember: GatewayGuildMemberUpdateDispatchData
	}
	[ListenerEvent.GuildMembersChunk]: Omit<
		GatewayGuildMembersChunkDispatchData,
		"members"
	> & {
		guild: Guild<true>
		rawMembers: GatewayGuildMembersChunkDispatchData["members"]
		members: GuildMember<false, true>[]
	}
	[ListenerEvent.GuildRoleCreate]: Omit<
		GatewayGuildRoleCreateDispatchData,
		"role"
	> & {
		guild: Guild<true>
		rawRole: GatewayGuildRoleCreateDispatchData["role"]
		role: Role
	}
	[ListenerEvent.GuildRoleDelete]: GatewayGuildRoleDeleteDispatchData & {
		guild: Guild<true>
		role: Role<true>
	}
	[ListenerEvent.GuildRoleUpdate]: Omit<
		GatewayGuildRoleUpdateDispatchData,
		"role"
	> & {
		guild: Guild<true>
		rawRole: GatewayGuildRoleUpdateDispatchData["role"]
		role: Role
	}
	[ListenerEvent.GuildScheduledEventCreate]: Omit<
		GatewayGuildScheduledEventCreateDispatchData,
		"creator"
	> & {
		guild: Guild<true>
		rawCreator: GatewayGuildScheduledEventCreateDispatchData["creator"]
		creator?: User
	}
	[ListenerEvent.GuildScheduledEventDelete]: GatewayGuildScheduledEventDeleteDispatchData & {
		guild: Guild<true>
	}
	[ListenerEvent.GuildScheduledEventUpdate]: GatewayGuildScheduledEventUpdateDispatchData & {
		guild: Guild<true>
	}
	[ListenerEvent.GuildScheduledEventUserAdd]: GatewayGuildScheduledEventUserAddDispatchData & {
		guild: Guild<true>
		user: User<true>
	}
	[ListenerEvent.GuildScheduledEventUserRemove]: GatewayGuildScheduledEventUserRemoveDispatchData & {
		guild: Guild<true>
		user: User<true>
	}
	[ListenerEvent.GuildSoundboardSoundCreate]: GatewayGuildSoundboardSoundCreateDispatchData & {
		guild?: Guild<true>
	}
	[ListenerEvent.GuildSoundboardSoundDelete]: GatewayGuildSoundboardSoundDeleteDispatchData & {
		guild: Guild<true>
	}
	[ListenerEvent.GuildSoundboardSoundUpdate]: GatewayGuildSoundboardSoundUpdateDispatchData & {
		guild?: Guild<true>
	}
	[ListenerEvent.GuildSoundboardSoundsUpdate]: GatewayGuildSoundboardSoundsUpdateDispatchData & {
		guild: Guild<true>
	}
	[ListenerEvent.SoundboardSounds]: GatewayGuildSoundboardSoundsUpdateDispatchData & {
		guild: Guild<true>
	}
	[ListenerEvent.GuildStickersUpdate]: GatewayGuildStickersUpdateDispatchData & {
		guild: Guild<true>
	}
	[ListenerEvent.GuildUpdate]: GatewayGuildUpdateDispatchData & {
		guild: Guild
	}
	[ListenerEvent.IntegrationCreate]: GatewayIntegrationCreateDispatchData & {
		guild: Guild<true>
	}
	[ListenerEvent.IntegrationDelete]: GatewayIntegrationDeleteDispatchData & {
		guild: Guild<true>
		application?: User<true>
	}
	[ListenerEvent.IntegrationUpdate]: GatewayIntegrationUpdateDispatchData & {
		guild: Guild<true>
	}
	[ListenerEvent.InteractionCreate]: GatewayInteractionCreateDispatchData
	[ListenerEvent.InviteCreate]: Omit<
		GatewayInviteCreateDispatchData,
		"inviter" | "target_user"
	> & {
		guild?: Guild<true>
		inviter?: User
		targetUser?: User
		rawInviter: GatewayInviteCreateDispatchData["inviter"]
		rawTargetUser: GatewayInviteCreateDispatchData["target_user"]
	}
	[ListenerEvent.InviteDelete]: GatewayInviteDeleteDispatchData & {
		guild?: Guild<true>
		channel?: Promise<AnyChannel>
	}
	[ListenerEvent.MessageCreate]: Omit<
		GatewayMessageCreateDispatchData,
		"member" | "author"
	> & {
		guild?: Guild<true>
		member?: GuildMember<false, true>
		author: User
		message: Message
		rawMessage: GatewayMessageCreateDispatchData
		rawMember: GatewayMessageCreateDispatchData["member"]
		rawAuthor: GatewayMessageCreateDispatchData["author"]
	}
	[ListenerEvent.MessageDelete]: GatewayMessageDeleteDispatchData & {
		guild?: Guild<true>
		message: Message<true>
	}
	[ListenerEvent.MessageDeleteBulk]: GatewayMessageDeleteBulkDispatchData & {
		guild?: Guild<true>
		messages: Message<true>[]
	}
	[ListenerEvent.MessagePollVoteAdd]: GatewayMessagePollVoteDispatchData & {
		guild?: Guild<true>
		user: User<true>
		message: Message<true>
	}
	[ListenerEvent.MessagePollVoteRemove]: GatewayMessagePollVoteDispatchData & {
		guild?: Guild<true>
		user: User<true>
		message: Message<true>
	}
	[ListenerEvent.MessageReactionAdd]: Omit<
		GatewayMessageReactionAddDispatchData,
		"member"
	> & {
		guild?: Guild<true>
		member?: GuildMember
		rawMember: GatewayMessageReactionAddDispatchData["member"]
		user: User<true>
		message: Message<true>
	}
	[ListenerEvent.MessageReactionRemove]: GatewayMessageReactionRemoveDispatchData & {
		guild?: Guild<true>
		user: User<true>
		message: Message<true>
	}
	[ListenerEvent.MessageReactionRemoveAll]: GatewayMessageReactionRemoveAllDispatchData & {
		guild?: Guild<true>
		message: Message<true>
	}
	[ListenerEvent.MessageReactionRemoveEmoji]: GatewayMessageReactionRemoveEmojiDispatchData & {
		guild?: Guild<true>
		message: Message<true>
	}
	[ListenerEvent.MessageUpdate]: Omit<
		GatewayMessageUpdateDispatchData,
		"message"
	> & {
		guild?: Guild<true>
		message: Message
	}
	[ListenerEvent.PresenceUpdate]: GatewayPresenceUpdateDispatchData & {
		guild: Guild<true>
		user: User<true>
	}
	[ListenerEvent.RateLimited]: GatewayRateLimitedDispatchData
	[ListenerEvent.Ready]: Omit<GatewayReadyDispatchData, "user"> & {
		user: User
		rawUser: GatewayReadyDispatchData["user"]
	}
	[ListenerEvent.Resumed]: GatewayResumedDispatch["d"]
	[ListenerEvent.StageInstanceCreate]: GatewayStageInstanceCreateDispatchData & {
		guild: Guild<true>
	}
	[ListenerEvent.StageInstanceDelete]: GatewayStageInstanceDeleteDispatchData & {
		guild: Guild<true>
	}
	[ListenerEvent.StageInstanceUpdate]: GatewayStageInstanceUpdateDispatchData & {
		guild: Guild<true>
	}
	[ListenerEvent.SubscriptionCreate]: GatewaySubscriptionCreateDispatchData & {
		user?: User<true>
	}
	[ListenerEvent.SubscriptionDelete]: GatewaySubscriptionDeleteDispatchData & {
		user?: User<true>
	}
	[ListenerEvent.SubscriptionUpdate]: GatewaySubscriptionUpdateDispatchData & {
		user?: User<true>
	}
	[ListenerEvent.ThreadCreate]: Omit<
		GatewayThreadCreateDispatchData,
		"thread"
	> & {
		guild?: Guild<true>
		thread: GuildThreadChannel<ThreadChannelType>
	}
	[ListenerEvent.ThreadDelete]: GatewayThreadDeleteDispatchData & {
		guild: Guild<true>
	}
	[ListenerEvent.ThreadListSync]: Omit<
		GatewayThreadListSyncDispatchData,
		"guild" | "threads"
	> & {
		guild: Guild<true>
		threads: GuildThreadChannel<ThreadChannelType>[]
		members: ThreadMember[]
		rawMembers: GatewayThreadListSyncDispatchData["members"]
		rawThreads: GatewayThreadListSyncDispatchData["threads"]
	}
	[ListenerEvent.ThreadMemberUpdate]: GatewayThreadMemberUpdateDispatchData & {
		guild: Guild<true>
		thread: GuildThreadChannel<ThreadChannelType, true>
		member?: ThreadMember
	}
	[ListenerEvent.ThreadMembersUpdate]: Omit<
		GatewayThreadMembersUpdateDispatchData,
		"thread"
	> & {
		guild: Guild<true>
		thread: GuildThreadChannel<ThreadChannelType, true>
		addedMembers?: ThreadMember[]
		removedMembers?: User<true>[]
	}
	[ListenerEvent.ThreadUpdate]: Omit<
		GatewayThreadUpdateDispatchData,
		"thread"
	> & {
		guild?: Guild<true>
		thread: GuildThreadChannel<ThreadChannelType, true>
	}
	[ListenerEvent.TypingStart]: Omit<
		GatewayTypingStartDispatchData,
		"member"
	> & {
		guild?: Guild<true>
		member?: GuildMember<false, true>
		user: User<true>
		rawMember: GatewayTypingStartDispatchData["member"]
	}
	[ListenerEvent.UserUpdate]: GatewayUserUpdateDispatchData & {
		user: User
	}
	[ListenerEvent.VoiceChannelEffectSend]: GatewayVoiceChannelEffectSendDispatchData & {
		guild: Guild<true>
		user: User<true>
	}
	[ListenerEvent.VoiceServerUpdate]: GatewayVoiceServerUpdateDispatchData & {
		guild: Guild<true>
	}
	[ListenerEvent.VoiceStateUpdate]: Omit<
		GatewayVoiceStateUpdateDispatchData,
		"member"
	> & {
		guild?: Guild<true>
		member?: GuildMember<false, true>
		rawMember: GatewayVoiceStateUpdateDispatchData["member"]
	}
	[ListenerEvent.WebhooksUpdate]: GatewayWebhooksUpdateDispatchData & {
		guild: Guild<true>
	}
}
```


### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| [ListenerEvent.GuildAvailable] | `Omit<
		GatewayGuildCreateDispatchData,
		"guild"
	> & {
		guild: Guild
	}` | Yes |  |
| [ListenerEvent.GuildUnavailable] | `Omit<
		GatewayGuildDeleteDispatchData,
		"guild"
	> & {
		guild: Guild<true>
	}` | Yes |  |
| [ListenerEvent.ApplicationAuthorized] | `Omit<
		APIWebhookEventApplicationAuthorizedData,
		"guild" | "user"
	> & {
		guild?: Guild
		user: User
		rawGuild: APIWebhookEventApplicationAuthorizedData["guild"]
		rawUser: APIWebhookEventApplicationAuthorizedData["user"]
	}` | Yes |  |
| [ListenerEvent.ApplicationDeauthorized] | `Omit<
		APIWebhookEventApplicationDeauthorizedData,
		"user"
	> & {
		user: User
		rawUser: APIWebhookEventApplicationDeauthorizedData["user"]
	}` | Yes |  |
| [ListenerEvent.EntitlementCreate] | `Omit<
		APIWebhookEventEntitlementCreateData,
		"guild" | "user"
	> & {
		guild?: Guild<true>
		user?: User<true>
	}` | Yes |  |
| [ListenerEvent.QuestUserEnrollment] | `APIWebhookEventQuestUserEnrollmentData` | Yes |  |
| [ListenerEvent.ApplicationCommandPermissionsUpdate] | `Omit<
		GatewayApplicationCommandPermissionsUpdateDispatchData,
		"guild"
	> & {
		guild: Guild<true>
	}` | Yes |  |
| [ListenerEvent.AutoModerationActionExecution] | `Omit<
		GatewayAutoModerationActionExecutionDispatchData,
		"guild" | "user" | "message"
	> & {
		guild: Guild<true>
		user: User<true>
		message?: Message<true>
	}` | Yes |  |
| [ListenerEvent.AutoModerationRuleCreate] | `Omit<
		GatewayAutoModerationRuleCreateDispatchData,
		"guild" | "creator"
	> & {
		guild: Guild<true>
		creator: User<true>
	}` | Yes |  |
| [ListenerEvent.AutoModerationRuleDelete] | `Omit<
		GatewayAutoModerationRuleDeleteDispatchData,
		"guild" | "creator"
	> & {
		guild: Guild<true>
		creator: User<true>
	}` | Yes |  |
| [ListenerEvent.AutoModerationRuleUpdate] | `Omit<
		GatewayAutoModerationRuleUpdateDispatchData,
		"guild" | "creator"
	> & {
		guild: Guild<true>
		creator: User<true>
	}` | Yes |  |
| [ListenerEvent.ChannelCreate] | `Omit<
		GatewayChannelCreateDispatchData,
		"channel"
	> & {
		channel?: AnyChannel
		rawChannel: GatewayChannelCreateDispatchData
	}` | Yes |  |
| [ListenerEvent.ChannelDelete] | `Omit<
		GatewayChannelDeleteDispatchData,
		"channel"
	> & {
		channel?: AnyChannel
		rawChannel: GatewayChannelDeleteDispatchData
	}` | Yes |  |
| [ListenerEvent.ChannelPinsUpdate] | `Omit<
		GatewayChannelPinsUpdateDispatchData,
		"guild" | "channel"
	> & {
		guild?: Guild<true>
		channel?: AnyChannel<true>
	}` | Yes |  |
| [ListenerEvent.ChannelUpdate] | `Omit<
		GatewayChannelUpdateDispatchData,
		"channel"
	> & {
		channel?: AnyChannel
		rawChannel: GatewayChannelUpdateDispatchData
	}` | Yes |  |
| [ListenerEvent.EntitlementDelete] | `GatewayEntitlementDeleteDispatchData & {
		guild?: Guild<true>
		user?: User<true>
	}` | Yes |  |
| [ListenerEvent.EntitlementUpdate] | `GatewayEntitlementUpdateDispatchData & {
		guild?: Guild<true>
		user?: User<true>
	}` | Yes |  |
| [ListenerEvent.GuildAuditLogEntryCreate] | `GatewayGuildAuditLogEntryCreateDispatchData & {
		guild: Guild<true>
		user: User<true>
		target?: User<true>
	}` | Yes |  |
| [ListenerEvent.GuildBanAdd] | `Omit<GatewayGuildBanAddDispatchData, "user"> & {
		guild: Guild<true>
		rawUser: GatewayGuildBanAddDispatchData["user"]
		user: User<false>
	}` | Yes |  |
| [ListenerEvent.GuildBanRemove] | `Omit<
		GatewayGuildBanRemoveDispatchData,
		"user"
	> & {
		guild: Guild<true>
		rawUser: GatewayGuildBanRemoveDispatchData["user"]
		user: User<false>
	}` | Yes |  |
| [ListenerEvent.GuildCreate] | `Omit<GatewayGuildCreateDispatchData, "guild"> & {
		guild: Guild
	}` | Yes |  |
| [ListenerEvent.GuildDelete] | `Omit<GatewayGuildDeleteDispatchData, "guild"> & {
		guild: Guild<true>
	}` | Yes |  |
| [ListenerEvent.GuildEmojisUpdate] | `GatewayGuildEmojisUpdateDispatchData & {
		guild: Guild<true>
	}` | Yes |  |
| [ListenerEvent.GuildIntegrationsUpdate] | `GatewayGuildIntegrationsUpdateDispatchData & {
		guild: Guild<true>
	}` | Yes |  |
| [ListenerEvent.GuildMemberAdd] | `Omit<
		GatewayGuildMemberAddDispatchData,
		"guild" | "member"
	> & {
		guild: Guild<true>
		member: GuildMember<false, true>
	}` | Yes |  |
| [ListenerEvent.GuildMemberRemove] | `Omit<
		GatewayGuildMemberRemoveDispatchData,
		"user"
	> & {
		guild: Guild<true>
		user: User<false>
		rawUser: GatewayGuildMemberRemoveDispatchData["user"]
	}` | Yes |  |
| [ListenerEvent.GuildMemberUpdate] | `Omit<
		GatewayGuildMemberUpdateDispatchData,
		"member"
	> & {
		guild: Guild<true>
		member: GuildMember<false, true>
		rawMember: GatewayGuildMemberUpdateDispatchData
	}` | Yes |  |
| [ListenerEvent.GuildMembersChunk] | `Omit<
		GatewayGuildMembersChunkDispatchData,
		"members"
	> & {
		guild: Guild<true>
		rawMembers: GatewayGuildMembersChunkDispatchData["members"]
		members: GuildMember<false, true>[]
	}` | Yes |  |
| [ListenerEvent.GuildRoleCreate] | `Omit<
		GatewayGuildRoleCreateDispatchData,
		"role"
	> & {
		guild: Guild<true>
		rawRole: GatewayGuildRoleCreateDispatchData["role"]
		role: Role
	}` | Yes |  |
| [ListenerEvent.GuildRoleDelete] | `GatewayGuildRoleDeleteDispatchData & {
		guild: Guild<true>
		role: Role<true>
	}` | Yes |  |
| [ListenerEvent.GuildRoleUpdate] | `Omit<
		GatewayGuildRoleUpdateDispatchData,
		"role"
	> & {
		guild: Guild<true>
		rawRole: GatewayGuildRoleUpdateDispatchData["role"]
		role: Role
	}` | Yes |  |
| [ListenerEvent.GuildScheduledEventCreate] | `Omit<
		GatewayGuildScheduledEventCreateDispatchData,
		"creator"
	> & {
		guild: Guild<true>
		rawCreator: GatewayGuildScheduledEventCreateDispatchData["creator"]
		creator?: User
	}` | Yes |  |
| [ListenerEvent.GuildScheduledEventDelete] | `GatewayGuildScheduledEventDeleteDispatchData & {
		guild: Guild<true>
	}` | Yes |  |
| [ListenerEvent.GuildScheduledEventUpdate] | `GatewayGuildScheduledEventUpdateDispatchData & {
		guild: Guild<true>
	}` | Yes |  |
| [ListenerEvent.GuildScheduledEventUserAdd] | `GatewayGuildScheduledEventUserAddDispatchData & {
		guild: Guild<true>
		user: User<true>
	}` | Yes |  |
| [ListenerEvent.GuildScheduledEventUserRemove] | `GatewayGuildScheduledEventUserRemoveDispatchData & {
		guild: Guild<true>
		user: User<true>
	}` | Yes |  |
| [ListenerEvent.GuildSoundboardSoundCreate] | `GatewayGuildSoundboardSoundCreateDispatchData & {
		guild?: Guild<true>
	}` | Yes |  |
| [ListenerEvent.GuildSoundboardSoundDelete] | `GatewayGuildSoundboardSoundDeleteDispatchData & {
		guild: Guild<true>
	}` | Yes |  |
| [ListenerEvent.GuildSoundboardSoundUpdate] | `GatewayGuildSoundboardSoundUpdateDispatchData & {
		guild?: Guild<true>
	}` | Yes |  |
| [ListenerEvent.GuildSoundboardSoundsUpdate] | `GatewayGuildSoundboardSoundsUpdateDispatchData & {
		guild: Guild<true>
	}` | Yes |  |
| [ListenerEvent.SoundboardSounds] | `GatewayGuildSoundboardSoundsUpdateDispatchData & {
		guild: Guild<true>
	}` | Yes |  |
| [ListenerEvent.GuildStickersUpdate] | `GatewayGuildStickersUpdateDispatchData & {
		guild: Guild<true>
	}` | Yes |  |
| [ListenerEvent.GuildUpdate] | `GatewayGuildUpdateDispatchData & {
		guild: Guild
	}` | Yes |  |
| [ListenerEvent.IntegrationCreate] | `GatewayIntegrationCreateDispatchData & {
		guild: Guild<true>
	}` | Yes |  |
| [ListenerEvent.IntegrationDelete] | `GatewayIntegrationDeleteDispatchData & {
		guild: Guild<true>
		application?: User<true>
	}` | Yes |  |
| [ListenerEvent.IntegrationUpdate] | `GatewayIntegrationUpdateDispatchData & {
		guild: Guild<true>
	}` | Yes |  |
| [ListenerEvent.InteractionCreate] | `GatewayInteractionCreateDispatchData` | Yes |  |
| [ListenerEvent.InviteCreate] | `Omit<
		GatewayInviteCreateDispatchData,
		"inviter" | "target_user"
	> & {
		guild?: Guild<true>
		inviter?: User
		targetUser?: User
		rawInviter: GatewayInviteCreateDispatchData["inviter"]
		rawTargetUser: GatewayInviteCreateDispatchData["target_user"]
	}` | Yes |  |
| [ListenerEvent.InviteDelete] | `GatewayInviteDeleteDispatchData & {
		guild?: Guild<true>
		channel?: Promise<AnyChannel>
	}` | Yes |  |
| [ListenerEvent.MessageCreate] | `Omit<
		GatewayMessageCreateDispatchData,
		"member" | "author"
	> & {
		guild?: Guild<true>
		member?: GuildMember<false, true>
		author: User
		message: Message
		rawMessage: GatewayMessageCreateDispatchData
		rawMember: GatewayMessageCreateDispatchData["member"]
		rawAuthor: GatewayMessageCreateDispatchData["author"]
	}` | Yes |  |
| [ListenerEvent.MessageDelete] | `GatewayMessageDeleteDispatchData & {
		guild?: Guild<true>
		message: Message<true>
	}` | Yes |  |
| [ListenerEvent.MessageDeleteBulk] | `GatewayMessageDeleteBulkDispatchData & {
		guild?: Guild<true>
		messages: Message<true>[]
	}` | Yes |  |
| [ListenerEvent.MessagePollVoteAdd] | `GatewayMessagePollVoteDispatchData & {
		guild?: Guild<true>
		user: User<true>
		message: Message<true>
	}` | Yes |  |
| [ListenerEvent.MessagePollVoteRemove] | `GatewayMessagePollVoteDispatchData & {
		guild?: Guild<true>
		user: User<true>
		message: Message<true>
	}` | Yes |  |
| [ListenerEvent.MessageReactionAdd] | `Omit<
		GatewayMessageReactionAddDispatchData,
		"member"
	> & {
		guild?: Guild<true>
		member?: GuildMember
		rawMember: GatewayMessageReactionAddDispatchData["member"]
		user: User<true>
		message: Message<true>
	}` | Yes |  |
| [ListenerEvent.MessageReactionRemove] | `GatewayMessageReactionRemoveDispatchData & {
		guild?: Guild<true>
		user: User<true>
		message: Message<true>
	}` | Yes |  |
| [ListenerEvent.MessageReactionRemoveAll] | `GatewayMessageReactionRemoveAllDispatchData & {
		guild?: Guild<true>
		message: Message<true>
	}` | Yes |  |
| [ListenerEvent.MessageReactionRemoveEmoji] | `GatewayMessageReactionRemoveEmojiDispatchData & {
		guild?: Guild<true>
		message: Message<true>
	}` | Yes |  |
| [ListenerEvent.MessageUpdate] | `Omit<
		GatewayMessageUpdateDispatchData,
		"message"
	> & {
		guild?: Guild<true>
		message: Message
	}` | Yes |  |
| [ListenerEvent.PresenceUpdate] | `GatewayPresenceUpdateDispatchData & {
		guild: Guild<true>
		user: User<true>
	}` | Yes |  |
| [ListenerEvent.RateLimited] | `GatewayRateLimitedDispatchData` | Yes |  |
| [ListenerEvent.Ready] | `Omit<GatewayReadyDispatchData, "user"> & {
		user: User
		rawUser: GatewayReadyDispatchData["user"]
	}` | Yes |  |
| [ListenerEvent.Resumed] | `GatewayResumedDispatch["d"]` | Yes |  |
| [ListenerEvent.StageInstanceCreate] | `GatewayStageInstanceCreateDispatchData & {
		guild: Guild<true>
	}` | Yes |  |
| [ListenerEvent.StageInstanceDelete] | `GatewayStageInstanceDeleteDispatchData & {
		guild: Guild<true>
	}` | Yes |  |
| [ListenerEvent.StageInstanceUpdate] | `GatewayStageInstanceUpdateDispatchData & {
		guild: Guild<true>
	}` | Yes |  |
| [ListenerEvent.SubscriptionCreate] | `GatewaySubscriptionCreateDispatchData & {
		user?: User<true>
	}` | Yes |  |
| [ListenerEvent.SubscriptionDelete] | `GatewaySubscriptionDeleteDispatchData & {
		user?: User<true>
	}` | Yes |  |
| [ListenerEvent.SubscriptionUpdate] | `GatewaySubscriptionUpdateDispatchData & {
		user?: User<true>
	}` | Yes |  |
| [ListenerEvent.ThreadCreate] | `Omit<
		GatewayThreadCreateDispatchData,
		"thread"
	> & {
		guild?: Guild<true>
		thread: GuildThreadChannel<ThreadChannelType>
	}` | Yes |  |
| [ListenerEvent.ThreadDelete] | `GatewayThreadDeleteDispatchData & {
		guild: Guild<true>
	}` | Yes |  |
| [ListenerEvent.ThreadListSync] | `Omit<
		GatewayThreadListSyncDispatchData,
		"guild" | "threads"
	> & {
		guild: Guild<true>
		threads: GuildThreadChannel<ThreadChannelType>[]
		members: ThreadMember[]
		rawMembers: GatewayThreadListSyncDispatchData["members"]
		rawThreads: GatewayThreadListSyncDispatchData["threads"]
	}` | Yes |  |
| [ListenerEvent.ThreadMemberUpdate] | `GatewayThreadMemberUpdateDispatchData & {
		guild: Guild<true>
		thread: GuildThreadChannel<ThreadChannelType, true>
		member?: ThreadMember
	}` | Yes |  |
| [ListenerEvent.ThreadMembersUpdate] | `Omit<
		GatewayThreadMembersUpdateDispatchData,
		"thread"
	> & {
		guild: Guild<true>
		thread: GuildThreadChannel<ThreadChannelType, true>
		addedMembers?: ThreadMember[]
		removedMembers?: User<true>[]
	}` | Yes |  |
| [ListenerEvent.ThreadUpdate] | `Omit<
		GatewayThreadUpdateDispatchData,
		"thread"
	> & {
		guild?: Guild<true>
		thread: GuildThreadChannel<ThreadChannelType, true>
	}` | Yes |  |
| [ListenerEvent.TypingStart] | `Omit<
		GatewayTypingStartDispatchData,
		"member"
	> & {
		guild?: Guild<true>
		member?: GuildMember<false, true>
		user: User<true>
		rawMember: GatewayTypingStartDispatchData["member"]
	}` | Yes |  |
| [ListenerEvent.UserUpdate] | `GatewayUserUpdateDispatchData & {
		user: User
	}` | Yes |  |
| [ListenerEvent.VoiceChannelEffectSend] | `GatewayVoiceChannelEffectSendDispatchData & {
		guild: Guild<true>
		user: User<true>
	}` | Yes |  |
| [ListenerEvent.VoiceServerUpdate] | `GatewayVoiceServerUpdateDispatchData & {
		guild: Guild<true>
	}` | Yes |  |
| [ListenerEvent.VoiceStateUpdate] | `Omit<
		GatewayVoiceStateUpdateDispatchData,
		"member"
	> & {
		guild?: Guild<true>
		member?: GuildMember<false, true>
		rawMember: GatewayVoiceStateUpdateDispatchData["member"]
	}` | Yes |  |
| [ListenerEvent.WebhooksUpdate] | `GatewayWebhooksUpdateDispatchData & {
		guild: Guild<true>
	}` | Yes |  |
