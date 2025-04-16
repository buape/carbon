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
	[ListenerEvent.ApplicationAuthorized]: {
		guild?: Guild
		user: User
	} & Omit<
		ListenerEventRawData[typeof ListenerEvent.ApplicationAuthorized],
		"guild" | "user"
	>
	[ListenerEvent.EntitlementCreate]: APIWebhookEventEntitlementCreateData & {
		guild?: Guild<true>
		user?: User<true>
	}
	[ListenerEvent.QuestUserEnrollment]: APIWebhookEventQuestUserEnrollmentData
	[ListenerEvent.ApplicationCommandPermissionsUpdate]: GatewayApplicationCommandPermissionsUpdateDispatchData & {
		guild: Guild<true>
	}
	[ListenerEvent.AutoModerationActionExecution]: GatewayAutoModerationActionExecutionDispatchData & {
		guild: Guild<true>
		user: User<true>
		message?: Message<true>
	}
	[ListenerEvent.AutoModerationRuleCreate]: GatewayAutoModerationRuleCreateDispatchData & {
		guild: Guild<true>
		creator: User<true>
	}
	[ListenerEvent.AutoModerationRuleDelete]: GatewayAutoModerationRuleDeleteDispatchData & {
		guild: Guild<true>
		creator: User<true>
	}
	[ListenerEvent.AutoModerationRuleUpdate]: GatewayAutoModerationRuleUpdateDispatchData & {
		guild: Guild<true>
		creator: User<true>
	}
	[ListenerEvent.ChannelCreate]: GatewayChannelCreateDispatchData & {
		channel?: AnyChannel
	}
	[ListenerEvent.ChannelDelete]: GatewayChannelDeleteDispatchData & {
		channel?: AnyChannel
	}
	[ListenerEvent.ChannelPinsUpdate]: GatewayChannelPinsUpdateDispatchData & {
		guild?: Guild<true>
		channel?: AnyChannel
	}
	[ListenerEvent.ChannelUpdate]: GatewayChannelUpdateDispatchData & {
		channel?: AnyChannel
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
	[ListenerEvent.GuildBanAdd]: GatewayGuildBanAddDispatchData & {
		guild: Guild<true>
		user: User<false>
	}
	[ListenerEvent.GuildBanRemove]: GatewayGuildBanRemoveDispatchData & {
		guild: Guild<true>
		user: User<false>
	}
	[ListenerEvent.GuildCreate]: GatewayGuildCreateDispatchData & {
		guild: Guild
	}
	[ListenerEvent.GuildDelete]: GatewayGuildDeleteDispatchData & {
		guild: Guild<true>
	}
	[ListenerEvent.GuildEmojisUpdate]: GatewayGuildEmojisUpdateDispatchData & {
		guild: Guild<true>
	}
	[ListenerEvent.GuildIntegrationsUpdate]: GatewayGuildIntegrationsUpdateDispatchData & {
		guild: Guild<true>
	}
	[ListenerEvent.GuildMemberAdd]: GatewayGuildMemberAddDispatchData & {
		guild: Guild<true>
		member: GuildMember
	}
	[ListenerEvent.GuildMemberRemove]: GatewayGuildMemberRemoveDispatchData & {
		guild: Guild<true>
		user: User<false>
	}
	[ListenerEvent.GuildMemberUpdate]: GatewayGuildMemberUpdateDispatchData & {
		guild: Guild<true>
		member: GuildMember
	}
	[ListenerEvent.GuildMembersChunk]: GatewayGuildMembersChunkDispatchData & {
		guild: Guild<true>
		members: GuildMember<false, true>[]
	}
	[ListenerEvent.GuildRoleCreate]: GatewayGuildRoleCreateDispatchData & {
		guild: Guild<true>
		role: Role
	}
	[ListenerEvent.GuildRoleDelete]: GatewayGuildRoleDeleteDispatchData & {
		guild: Guild<true>
		role: Role<true>
	}
	[ListenerEvent.GuildRoleUpdate]: GatewayGuildRoleUpdateDispatchData & {
		guild: Guild<true>
		role: Role
	}
	[ListenerEvent.GuildScheduledEventCreate]: GatewayGuildScheduledEventCreateDispatchData & {
		guild: Guild<true>
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
	[ListenerEvent.InteractionCreate]: GatewayInteractionCreateDispatchData & {
		guild?: Guild<true>
		member?: GuildMember
		user: User
	}
	[ListenerEvent.InviteCreate]: GatewayInviteCreateDispatchData & {
		guild: Guild<true>
		inviter?: User<true>
		targetUser?: User<true>
	}
	[ListenerEvent.InviteDelete]: GatewayInviteDeleteDispatchData & {
		guild: Guild<true>
	}
	[ListenerEvent.MessageCreate]: GatewayMessageCreateDispatchData & {
		guild?: Guild<true>
		member?: GuildMember<false, true>
		author: User
		message: Message
	}
	[ListenerEvent.MessageDelete]: GatewayMessageDeleteDispatchData & {
		guild?: Guild<true>
		message: Message<true>
	}
	[ListenerEvent.MessageDeleteBulk]: GatewayMessageDeleteBulkDispatchData & {
		guild?: Guild<true>
		messages: Message<true>[]
	}
	[ListenerEvent.MessageReactionAdd]: GatewayMessageReactionAddDispatchData & {
		guild?: Guild<true>
		member?: GuildMember
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
	[ListenerEvent.MessageUpdate]: GatewayMessageUpdateDispatchData & {
		guild?: Guild<true>
		message: Message
	}
	[ListenerEvent.PresenceUpdate]: GatewayPresenceUpdateDispatchData & {
		guild: Guild<true>
		user: User<true>
	}
	[ListenerEvent.Ready]: GatewayReadyDispatchData & {
		user: User
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
	[ListenerEvent.ThreadCreate]: GatewayThreadCreateDispatchData & {
		guild?: Guild<true>
		thread: GuildThreadChannel<ThreadChannelType>
	}
	[ListenerEvent.ThreadDelete]: GatewayThreadDeleteDispatchData & {
		guild: Guild<true>
	}
	[ListenerEvent.ThreadListSync]: GatewayThreadListSyncDispatchData & {
		guild: Guild<true>
		threads: GuildThreadChannel<ThreadChannelType>[]
	}
	[ListenerEvent.ThreadMemberUpdate]: GatewayThreadMemberUpdateDispatchData & {
		guild: Guild<true>
		thread: GuildThreadChannel<ThreadChannelType, true>
		member?: GuildMember<false, true>
	}
	[ListenerEvent.ThreadMembersUpdate]: GatewayThreadMembersUpdateDispatchData & {
		guild: Guild<true>
		thread: GuildThreadChannel<ThreadChannelType, true>
		addedMembers?: GuildMember<false, true>[]
		removedMembers?: User<true>[]
	}
	[ListenerEvent.ThreadUpdate]: GatewayThreadUpdateDispatchData & {
		guild?: Guild<true>
		thread: GuildThreadChannel<ThreadChannelType, true>
	}
	[ListenerEvent.TypingStart]: GatewayTypingStartDispatchData & {
		guild?: Guild<true>
		member?: GuildMember<false, true>
		user: User<true>
	}
	[ListenerEvent.UserUpdate]: GatewayUserUpdateDispatchData & {
		user: User
	}
	[ListenerEvent.VoiceServerUpdate]: GatewayVoiceServerUpdateDispatchData & {
		guild: Guild<true>
	}
	[ListenerEvent.VoiceStateUpdate]: GatewayVoiceStateUpdateDispatchData & {
		guild?: Guild<true>
		member?: GuildMember<false, true>
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
