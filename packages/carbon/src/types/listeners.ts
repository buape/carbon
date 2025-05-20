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
	}
	[ListenerEvent.ChannelDelete]: Omit<
		GatewayChannelDeleteDispatchData,
		"channel"
	> & {
		channel?: AnyChannel
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
	}
	[ListenerEvent.EntitlementDelete]: Omit<
		GatewayEntitlementDeleteDispatchData,
		"guild" | "user"
	> & {
		guild?: Guild<true>
		user?: User<true>
	}
	[ListenerEvent.EntitlementUpdate]: Omit<
		GatewayEntitlementUpdateDispatchData,
		"guild" | "user"
	> & {
		guild?: Guild<true>
		user?: User<true>
	}
	[ListenerEvent.GuildAuditLogEntryCreate]: Omit<
		GatewayGuildAuditLogEntryCreateDispatchData,
		"guild" | "user" | "target"
	> & {
		guild: Guild<true>
		user: User<true>
		target?: User<true>
	}
	[ListenerEvent.GuildBanAdd]: Omit<
		GatewayGuildBanAddDispatchData,
		"guild" | "user"
	> & {
		guild: Guild<true>
		user: User<false>
	}
	[ListenerEvent.GuildBanRemove]: Omit<
		GatewayGuildBanRemoveDispatchData,
		"guild" | "user"
	> & {
		guild: Guild<true>
		user: User<false>
	}
	[ListenerEvent.GuildCreate]: Omit<GatewayGuildCreateDispatchData, "guild"> & {
		guild: Guild
	}
	[ListenerEvent.GuildDelete]: Omit<GatewayGuildDeleteDispatchData, "guild"> & {
		guild: Guild<true>
	}
	[ListenerEvent.GuildEmojisUpdate]: Omit<
		GatewayGuildEmojisUpdateDispatchData,
		"guild"
	> & {
		guild: Guild<true>
	}
	[ListenerEvent.GuildIntegrationsUpdate]: Omit<
		GatewayGuildIntegrationsUpdateDispatchData,
		"guild"
	> & {
		guild: Guild<true>
	}
	[ListenerEvent.GuildMemberAdd]: Omit<
		GatewayGuildMemberAddDispatchData,
		"guild" | "member"
	> & {
		guild: Guild<true>
		member: GuildMember
	}
	[ListenerEvent.GuildMemberRemove]: Omit<
		GatewayGuildMemberRemoveDispatchData,
		"guild" | "user"
	> & {
		guild: Guild<true>
		user: User<false>
	}
	[ListenerEvent.GuildMemberUpdate]: Omit<
		GatewayGuildMemberUpdateDispatchData,
		"guild" | "member"
	> & {
		guild: Guild<true>
		member: GuildMember
	}
	[ListenerEvent.GuildMembersChunk]: Omit<
		GatewayGuildMembersChunkDispatchData,
		"guild" | "members"
	> & {
		guild: Guild<true>
		members: GuildMember<false, true>[]
	}
	[ListenerEvent.GuildRoleCreate]: Omit<
		GatewayGuildRoleCreateDispatchData,
		"guild" | "role"
	> & {
		guild: Guild<true>
		role: Role
	}
	[ListenerEvent.GuildRoleDelete]: Omit<
		GatewayGuildRoleDeleteDispatchData,
		"guild" | "role"
	> & {
		guild: Guild<true>
		role: Role<true>
	}
	[ListenerEvent.GuildRoleUpdate]: Omit<
		GatewayGuildRoleUpdateDispatchData,
		"guild" | "role"
	> & {
		guild: Guild<true>
		role: Role
	}
	[ListenerEvent.GuildScheduledEventCreate]: Omit<
		GatewayGuildScheduledEventCreateDispatchData,
		"guild" | "creator"
	> & {
		guild: Guild<true>
		creator?: User
	}
	[ListenerEvent.GuildScheduledEventDelete]: Omit<
		GatewayGuildScheduledEventDeleteDispatchData,
		"guild"
	> & {
		guild: Guild<true>
	}
	[ListenerEvent.GuildScheduledEventUpdate]: Omit<
		GatewayGuildScheduledEventUpdateDispatchData,
		"guild"
	> & {
		guild: Guild<true>
	}
	[ListenerEvent.GuildScheduledEventUserAdd]: Omit<
		GatewayGuildScheduledEventUserAddDispatchData,
		"guild" | "user"
	> & {
		guild: Guild<true>
		user: User<true>
	}
	[ListenerEvent.GuildScheduledEventUserRemove]: Omit<
		GatewayGuildScheduledEventUserRemoveDispatchData,
		"guild" | "user"
	> & {
		guild: Guild<true>
		user: User<true>
	}
	[ListenerEvent.GuildSoundboardSoundCreate]: Omit<
		GatewayGuildSoundboardSoundCreateDispatchData,
		"guild"
	> & {
		guild?: Guild<true>
	}
	[ListenerEvent.GuildSoundboardSoundDelete]: Omit<
		GatewayGuildSoundboardSoundDeleteDispatchData,
		"guild"
	> & {
		guild: Guild<true>
	}
	[ListenerEvent.GuildSoundboardSoundUpdate]: Omit<
		GatewayGuildSoundboardSoundUpdateDispatchData,
		"guild"
	> & {
		guild?: Guild<true>
	}
	[ListenerEvent.GuildSoundboardSoundsUpdate]: Omit<
		GatewayGuildSoundboardSoundsUpdateDispatchData,
		"guild"
	> & {
		guild: Guild<true>
	}
	[ListenerEvent.SoundboardSounds]: Omit<
		GatewayGuildSoundboardSoundsUpdateDispatchData,
		"guild"
	> & {
		guild: Guild<true>
	}
	[ListenerEvent.GuildStickersUpdate]: Omit<
		GatewayGuildStickersUpdateDispatchData,
		"guild"
	> & {
		guild: Guild<true>
	}
	[ListenerEvent.GuildUpdate]: Omit<GatewayGuildUpdateDispatchData, "guild"> & {
		guild: Guild
	}
	[ListenerEvent.IntegrationCreate]: Omit<
		GatewayIntegrationCreateDispatchData,
		"guild"
	> & {
		guild: Guild<true>
	}
	[ListenerEvent.IntegrationDelete]: Omit<
		GatewayIntegrationDeleteDispatchData,
		"guild" | "application"
	> & {
		guild: Guild<true>
		application?: User<true>
	}
	[ListenerEvent.IntegrationUpdate]: Omit<
		GatewayIntegrationUpdateDispatchData,
		"guild"
	> & {
		guild: Guild<true>
	}
	[ListenerEvent.InteractionCreate]: Omit<
		GatewayInteractionCreateDispatchData,
		"guild" | "member" | "user"
	> & {
		guild?: Guild<true>
		member?: GuildMember
		user: User
	}
	[ListenerEvent.InviteCreate]: Omit<
		GatewayInviteCreateDispatchData,
		"guild" | "inviter" | "targetUser"
	> & {
		guild: Guild<true>
		inviter?: User<true>
		targetUser?: User<true>
	}
	[ListenerEvent.InviteDelete]: Omit<
		GatewayInviteDeleteDispatchData,
		"guild"
	> & {
		guild: Guild<true>
	}
	[ListenerEvent.MessageCreate]: Omit<
		GatewayMessageCreateDispatchData,
		"member" | "author"
	> & {
		guild?: Guild<true>
		member?: GuildMember<false, true>
		author: User
		message: Message
	}
	[ListenerEvent.MessageDelete]: Omit<
		GatewayMessageDeleteDispatchData,
		"guild"
	> & {
		guild?: Guild<true>
		message: Message<true>
	}
	[ListenerEvent.MessageDeleteBulk]: Omit<
		GatewayMessageDeleteBulkDispatchData,
		"guild"
	> & {
		guild?: Guild<true>
		messages: Message<true>[]
	}
	[ListenerEvent.MessageReactionAdd]: Omit<
		GatewayMessageReactionAddDispatchData,
		"guild" | "member"
	> & {
		guild?: Guild<true>
		member?: GuildMember
		user: User<true>
		message: Message<true>
	}
	[ListenerEvent.MessageReactionRemove]: Omit<
		GatewayMessageReactionRemoveDispatchData,
		"guild"
	> & {
		guild?: Guild<true>
		user: User<true>
		message: Message<true>
	}
	[ListenerEvent.MessageReactionRemoveAll]: Omit<
		GatewayMessageReactionRemoveAllDispatchData,
		"guild" | "message"
	> & {
		guild?: Guild<true>
		message: Message<true>
	}
	[ListenerEvent.MessageReactionRemoveEmoji]: Omit<
		GatewayMessageReactionRemoveEmojiDispatchData,
		"guild" | "message"
	> & {
		guild?: Guild<true>
		message: Message<true>
	}
	[ListenerEvent.MessageUpdate]: Omit<
		GatewayMessageUpdateDispatchData,
		"guild" | "message"
	> & {
		guild?: Guild<true>
		message: Message
	}
	[ListenerEvent.PresenceUpdate]: Omit<
		GatewayPresenceUpdateDispatchData,
		"guild" | "user"
	> & {
		guild: Guild<true>
		user: User<true>
	}
	[ListenerEvent.Ready]: Omit<GatewayReadyDispatchData, "user"> & {
		user: User
	}
	[ListenerEvent.Resumed]: GatewayResumedDispatch["d"]
	[ListenerEvent.StageInstanceCreate]: Omit<
		GatewayStageInstanceCreateDispatchData,
		"guild"
	> & {
		guild: Guild<true>
	}
	[ListenerEvent.StageInstanceDelete]: Omit<
		GatewayStageInstanceDeleteDispatchData,
		"guild"
	> & {
		guild: Guild<true>
	}
	[ListenerEvent.StageInstanceUpdate]: Omit<
		GatewayStageInstanceUpdateDispatchData,
		"guild"
	> & {
		guild: Guild<true>
	}
	[ListenerEvent.SubscriptionCreate]: Omit<
		GatewaySubscriptionCreateDispatchData,
		"user"
	> & {
		user?: User<true>
	}
	[ListenerEvent.SubscriptionDelete]: Omit<
		GatewaySubscriptionDeleteDispatchData,
		"user"
	> & {
		user?: User<true>
	}
	[ListenerEvent.SubscriptionUpdate]: Omit<
		GatewaySubscriptionUpdateDispatchData,
		"user"
	> & {
		user?: User<true>
	}
	[ListenerEvent.ThreadCreate]: Omit<
		GatewayThreadCreateDispatchData,
		"guild" | "thread"
	> & {
		guild?: Guild<true>
		thread: GuildThreadChannel<ThreadChannelType>
	}
	[ListenerEvent.ThreadDelete]: Omit<
		GatewayThreadDeleteDispatchData,
		"guild"
	> & {
		guild: Guild<true>
	}
	[ListenerEvent.ThreadListSync]: Omit<
		GatewayThreadListSyncDispatchData,
		"guild" | "threads"
	> & {
		guild: Guild<true>
		threads: GuildThreadChannel<ThreadChannelType>[]
	}
	[ListenerEvent.ThreadMemberUpdate]: Omit<
		GatewayThreadMemberUpdateDispatchData,
		"guild" | "thread" | "member"
	> & {
		guild: Guild<true>
		thread: GuildThreadChannel<ThreadChannelType, true>
		member?: GuildMember<false, true>
	}
	[ListenerEvent.ThreadMembersUpdate]: Omit<
		GatewayThreadMembersUpdateDispatchData,
		"guild" | "thread" | "added_members"
	> & {
		guild: Guild<true>
		thread: GuildThreadChannel<ThreadChannelType, true>
		addedMembers?: GuildMember<false, true>[]
		removedMembers?: User<true>[]
	}
	[ListenerEvent.ThreadUpdate]: Omit<
		GatewayThreadUpdateDispatchData,
		"guild" | "thread"
	> & {
		guild?: Guild<true>
		thread: GuildThreadChannel<ThreadChannelType, true>
	}
	[ListenerEvent.TypingStart]: Omit<
		GatewayTypingStartDispatchData,
		"guild" | "member" | "user"
	> & {
		guild?: Guild<true>
		member?: GuildMember<false, true>
		user: User<true>
	}
	[ListenerEvent.UserUpdate]: Omit<GatewayUserUpdateDispatchData, "user"> & {
		user: User
	}
	[ListenerEvent.VoiceServerUpdate]: Omit<
		GatewayVoiceServerUpdateDispatchData,
		"guild"
	> & {
		guild: Guild<true>
	}
	[ListenerEvent.VoiceStateUpdate]: Omit<
		GatewayVoiceStateUpdateDispatchData,
		"guild" | "member"
	> & {
		guild?: Guild<true>
		member?: GuildMember<false, true>
	}
	[ListenerEvent.WebhooksUpdate]: Omit<
		GatewayWebhooksUpdateDispatchData,
		"guild"
	> & {
		guild: Guild<true>
	}
	[ListenerEvent.MessagePollVoteAdd]: Omit<
		GatewayMessagePollVoteDispatchData,
		"guild" | "user" | "message"
	> & {
		guild?: Guild<true>
		user: User<true>
		message: Message<true>
	}
	[ListenerEvent.MessagePollVoteRemove]: Omit<
		GatewayMessagePollVoteDispatchData,
		"guild" | "user" | "message"
	> & {
		guild?: Guild<true>
		user: User<true>
		message: Message<true>
	}
	[ListenerEvent.VoiceChannelEffectSend]: Omit<
		GatewayVoiceChannelEffectSendDispatchData,
		"guild" | "user"
	> & {
		guild: Guild<true>
		user: User<true>
	}
}
