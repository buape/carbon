import {
	ApplicationWebhookEventType,
	GatewayDispatchEvents
} from "discord-api-types/v9"
import type {
	APIWebhookEventApplicationAuthorizedData,
	APIWebhookEventEntitlementCreateData,
	APIWebhookEventQuestUserEnrollmentData,
	GatewayApplicationCommandPermissionsUpdateDispatchData,
	GatewayAutoModerationActionExecutionDispatchData,
	GatewayAutoModerationRuleCreateDispatchData,
	GatewayAutoModerationRuleDeleteDispatchData,
	GatewayAutoModerationRuleUpdateDispatchData,
	GatewayChannelCreateDispatchData,
	GatewayChannelDeleteDispatchData,
	GatewayChannelPinsUpdateDispatchData,
	GatewayChannelUpdateDispatchData,
	GatewayEntitlementDeleteDispatchData,
	GatewayEntitlementUpdateDispatchData,
	GatewayGuildAuditLogEntryCreateDispatchData,
	GatewayGuildBanAddDispatchData,
	GatewayGuildBanRemoveDispatchData,
	GatewayGuildCreateDispatchData,
	GatewayGuildDeleteDispatchData,
	GatewayGuildEmojisUpdateDispatchData,
	GatewayGuildIntegrationsUpdateDispatchData,
	GatewayGuildMemberAddDispatchData,
	GatewayGuildMemberRemoveDispatchData,
	GatewayGuildMemberUpdateDispatchData,
	GatewayGuildMembersChunkDispatchData,
	GatewayGuildRoleCreateDispatchData,
	GatewayGuildRoleDeleteDispatchData,
	GatewayGuildRoleUpdateDispatchData,
	GatewayGuildScheduledEventCreateDispatchData,
	GatewayGuildScheduledEventDeleteDispatchData,
	GatewayGuildScheduledEventUpdateDispatchData,
	GatewayGuildScheduledEventUserAddDispatchData,
	GatewayGuildScheduledEventUserRemoveDispatchData,
	GatewayGuildSoundboardSoundCreateDispatchData,
	GatewayGuildSoundboardSoundDeleteDispatchData,
	GatewayGuildSoundboardSoundUpdateDispatchData,
	GatewayGuildSoundboardSoundsUpdateDispatchData,
	GatewayGuildStickersUpdateDispatchData,
	GatewayGuildUpdateDispatchData,
	GatewayIntegrationCreateDispatchData,
	GatewayIntegrationDeleteDispatchData,
	GatewayIntegrationUpdateDispatchData,
	GatewayInteractionCreateDispatchData,
	GatewayInviteCreateDispatchData,
	GatewayInviteDeleteDispatchData,
	GatewayMessageCreateDispatchData,
	GatewayMessageDeleteBulkDispatchData,
	GatewayMessageDeleteDispatchData,
	GatewayMessagePollVoteDispatchData,
	GatewayMessageReactionAddDispatchData,
	GatewayMessageReactionRemoveAllDispatchData,
	GatewayMessageReactionRemoveDispatchData,
	GatewayMessageReactionRemoveEmojiDispatchData,
	GatewayMessageUpdateDispatchData,
	GatewayPresenceUpdateDispatchData,
	GatewayReadyDispatchData,
	GatewayResumedDispatch,
	GatewayStageInstanceCreateDispatchData,
	GatewayStageInstanceDeleteDispatchData,
	GatewayStageInstanceUpdateDispatchData,
	GatewaySubscriptionCreateDispatchData,
	GatewaySubscriptionDeleteDispatchData,
	GatewaySubscriptionUpdateDispatchData,
	GatewayThreadCreateDispatchData,
	GatewayThreadDeleteDispatchData,
	GatewayThreadListSyncDispatchData,
	GatewayThreadMemberUpdateDispatchData,
	GatewayThreadMembersUpdateDispatchData,
	GatewayThreadUpdateDispatchData,
	GatewayTypingStartDispatchData,
	GatewayUserUpdateDispatchData,
	GatewayVoiceChannelEffectSendDispatchData,
	GatewayVoiceServerUpdateDispatchData,
	GatewayVoiceStateUpdateDispatchData,
	GatewayWebhooksUpdateDispatchData,
	ThreadChannelType
} from "discord-api-types/v10"
import type { AnyChannel } from "../functions/channelFactory.js"
import type { Guild } from "../structures/Guild.js"
import type { GuildMember } from "../structures/GuildMember.js"
import type { GuildThreadChannel } from "../structures/GuildThreadChannel.js"
import type { Message } from "../structures/Message.js"
import type { Role } from "../structures/Role.js"
import type { ThreadMember } from "../structures/ThreadMember.js"
import type { User } from "../structures/User.js"

export const WebhookEvent = {
	...ApplicationWebhookEventType
}

export const GatewayEvent = {
	...GatewayDispatchEvents
}

export const ListenerEvent = {
	...GatewayEvent,
	...WebhookEvent
}

export type ListenerEventType =
	(typeof ListenerEvent)[keyof typeof ListenerEvent]

export type ListenerEventRawData = {
	[ListenerEvent.ApplicationAuthorized]: APIWebhookEventApplicationAuthorizedData
	[ListenerEvent.EntitlementCreate]: APIWebhookEventEntitlementCreateData
	[ListenerEvent.QuestUserEnrollment]: APIWebhookEventQuestUserEnrollmentData
	[ListenerEvent.ApplicationCommandPermissionsUpdate]: GatewayApplicationCommandPermissionsUpdateDispatchData
	[ListenerEvent.AutoModerationActionExecution]: GatewayAutoModerationActionExecutionDispatchData
	[ListenerEvent.AutoModerationRuleCreate]: GatewayAutoModerationRuleCreateDispatchData
	[ListenerEvent.AutoModerationRuleDelete]: GatewayAutoModerationRuleDeleteDispatchData
	[ListenerEvent.AutoModerationRuleUpdate]: GatewayAutoModerationRuleUpdateDispatchData
	[ListenerEvent.ChannelCreate]: GatewayChannelCreateDispatchData
	[ListenerEvent.ChannelDelete]: GatewayChannelDeleteDispatchData
	[ListenerEvent.ChannelPinsUpdate]: GatewayChannelPinsUpdateDispatchData
	[ListenerEvent.ChannelUpdate]: GatewayChannelUpdateDispatchData
	[ListenerEvent.EntitlementDelete]: GatewayEntitlementDeleteDispatchData
	[ListenerEvent.EntitlementUpdate]: GatewayEntitlementUpdateDispatchData
	[ListenerEvent.GuildAuditLogEntryCreate]: GatewayGuildAuditLogEntryCreateDispatchData
	[ListenerEvent.GuildBanAdd]: GatewayGuildBanAddDispatchData
	[ListenerEvent.GuildBanRemove]: GatewayGuildBanRemoveDispatchData
	[ListenerEvent.GuildCreate]: GatewayGuildCreateDispatchData
	[ListenerEvent.GuildDelete]: GatewayGuildDeleteDispatchData
	[ListenerEvent.GuildEmojisUpdate]: GatewayGuildEmojisUpdateDispatchData
	[ListenerEvent.GuildIntegrationsUpdate]: GatewayGuildIntegrationsUpdateDispatchData
	[ListenerEvent.GuildMemberAdd]: GatewayGuildMemberAddDispatchData
	[ListenerEvent.GuildMemberRemove]: GatewayGuildMemberRemoveDispatchData
	[ListenerEvent.GuildMemberUpdate]: GatewayGuildMemberUpdateDispatchData
	[ListenerEvent.GuildMembersChunk]: GatewayGuildMembersChunkDispatchData
	[ListenerEvent.GuildRoleCreate]: GatewayGuildRoleCreateDispatchData
	[ListenerEvent.GuildRoleDelete]: GatewayGuildRoleDeleteDispatchData
	[ListenerEvent.GuildRoleUpdate]: GatewayGuildRoleUpdateDispatchData
	[ListenerEvent.GuildScheduledEventCreate]: GatewayGuildScheduledEventCreateDispatchData
	[ListenerEvent.GuildScheduledEventDelete]: GatewayGuildScheduledEventDeleteDispatchData
	[ListenerEvent.GuildScheduledEventUpdate]: GatewayGuildScheduledEventUpdateDispatchData
	[ListenerEvent.GuildScheduledEventUserAdd]: GatewayGuildScheduledEventUserAddDispatchData
	[ListenerEvent.GuildScheduledEventUserRemove]: GatewayGuildScheduledEventUserRemoveDispatchData
	[ListenerEvent.GuildSoundboardSoundCreate]: GatewayGuildSoundboardSoundCreateDispatchData
	[ListenerEvent.GuildSoundboardSoundDelete]: GatewayGuildSoundboardSoundDeleteDispatchData
	[ListenerEvent.GuildSoundboardSoundUpdate]: GatewayGuildSoundboardSoundUpdateDispatchData
	[ListenerEvent.GuildSoundboardSoundsUpdate]: GatewayGuildSoundboardSoundsUpdateDispatchData
	[ListenerEvent.SoundboardSounds]: GatewayGuildSoundboardSoundsUpdateDispatchData
	[ListenerEvent.GuildStickersUpdate]: GatewayGuildStickersUpdateDispatchData
	[ListenerEvent.GuildUpdate]: GatewayGuildUpdateDispatchData
	[ListenerEvent.IntegrationCreate]: GatewayIntegrationCreateDispatchData
	[ListenerEvent.IntegrationDelete]: GatewayIntegrationDeleteDispatchData
	[ListenerEvent.IntegrationUpdate]: GatewayIntegrationUpdateDispatchData
	[ListenerEvent.InteractionCreate]: GatewayInteractionCreateDispatchData
	[ListenerEvent.InviteCreate]: GatewayInviteCreateDispatchData
	[ListenerEvent.InviteDelete]: GatewayInviteDeleteDispatchData
	[ListenerEvent.MessageCreate]: GatewayMessageCreateDispatchData
	[ListenerEvent.MessageDelete]: GatewayMessageDeleteDispatchData
	[ListenerEvent.MessageDeleteBulk]: GatewayMessageDeleteBulkDispatchData
	[ListenerEvent.MessageReactionAdd]: GatewayMessageReactionAddDispatchData
	[ListenerEvent.MessageReactionRemove]: GatewayMessageReactionRemoveDispatchData
	[ListenerEvent.MessageReactionRemoveAll]: GatewayMessageReactionRemoveAllDispatchData
	[ListenerEvent.MessageReactionRemoveEmoji]: GatewayMessageReactionRemoveEmojiDispatchData
	[ListenerEvent.MessageUpdate]: GatewayMessageUpdateDispatchData
	[ListenerEvent.PresenceUpdate]: GatewayPresenceUpdateDispatchData
	[ListenerEvent.Ready]: GatewayReadyDispatchData
	[ListenerEvent.Resumed]: GatewayResumedDispatch["d"]
	[ListenerEvent.StageInstanceCreate]: GatewayStageInstanceCreateDispatchData
	[ListenerEvent.StageInstanceDelete]: GatewayStageInstanceDeleteDispatchData
	[ListenerEvent.StageInstanceUpdate]: GatewayStageInstanceUpdateDispatchData
	[ListenerEvent.SubscriptionCreate]: GatewaySubscriptionCreateDispatchData
	[ListenerEvent.SubscriptionDelete]: GatewaySubscriptionDeleteDispatchData
	[ListenerEvent.SubscriptionUpdate]: GatewaySubscriptionUpdateDispatchData
	[ListenerEvent.ThreadCreate]: GatewayThreadCreateDispatchData
	[ListenerEvent.ThreadDelete]: GatewayThreadDeleteDispatchData
	[ListenerEvent.ThreadListSync]: GatewayThreadListSyncDispatchData
	[ListenerEvent.ThreadMemberUpdate]: GatewayThreadMemberUpdateDispatchData
	[ListenerEvent.ThreadMembersUpdate]: GatewayThreadMembersUpdateDispatchData
	[ListenerEvent.ThreadUpdate]: GatewayThreadUpdateDispatchData
	[ListenerEvent.TypingStart]: GatewayTypingStartDispatchData
	[ListenerEvent.UserUpdate]: GatewayUserUpdateDispatchData
	[ListenerEvent.VoiceServerUpdate]: GatewayVoiceServerUpdateDispatchData
	[ListenerEvent.VoiceStateUpdate]: GatewayVoiceStateUpdateDispatchData
	[ListenerEvent.WebhooksUpdate]: GatewayWebhooksUpdateDispatchData
	[ListenerEvent.MessagePollVoteAdd]: GatewayMessagePollVoteDispatchData
	[ListenerEvent.MessagePollVoteRemove]: GatewayMessagePollVoteDispatchData
	[ListenerEvent.VoiceChannelEffectSend]: GatewayVoiceChannelEffectSendDispatchData
}

export type ListenerEventData = {
	[ListenerEvent.ApplicationAuthorized]: Omit<
		APIWebhookEventApplicationAuthorizedData,
		"guild" | "user"
	> & {
		guild?: Guild
		user: User
		rawGuild: APIWebhookEventApplicationAuthorizedData["guild"]
		rawUser: APIWebhookEventApplicationAuthorizedData["user"]
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
		channel?: AnyChannel
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
	[ListenerEvent.InteractionCreate]: Omit<
		GatewayInteractionCreateDispatchData,
		"user"
	> & {
		guild?: Guild<true>
		user: User
		rawUser: GatewayInteractionCreateDispatchData["user"]
	}
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
	[ListenerEvent.VoiceChannelEffectSend]: GatewayVoiceChannelEffectSendDispatchData & {
		guild: Guild<true>
		user: User<true>
	}
}
