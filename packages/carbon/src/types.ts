import type { APIAllowedMentions } from "discord-api-types/v10"
import {
	ApplicationWebhookEventType,
	GatewayDispatchEvents
} from "discord-api-types/v10"
import type { Embed } from "./classes/Embed.js"
import type { Row } from "./classes/Row.js"

export type AllowedMentions = APIAllowedMentions

/**
/**
 * The data that is sent to Discord when sending a message.
 * If you pass just a string, it will be treated as the content of the message.
 */
export type MessagePayload =
	| {
			/**
			 * The content of the message
			 */
			content?: string
			/**
			 * The embeds of the message
			 */
			embeds?: Embed[]
			/**
			 * The components to send in the message, listed in rows
			 */
			components?: Row[]
			/**
			 * The settings for which mentions are allowed in the message
			 */
			allowedMentions?: AllowedMentions
			/**
			 * The flags for the message
			 */
			flags?: number
			/**
			 * Whether the message should be TTS
			 */
			tts?: boolean
			/**
			 * The files to send in the message
			 */
			files?: MessagePayloadFile[]
	  }
	| string

/**
 * The data for a file to send in an interaction
 */
export type MessagePayloadFile = {
	/**
	 * The name of the file that will be given to Discord
	 */
	name: string
	/**
	 * The data of the file in a Blob
	 */
	data: Blob
	/**
	 * The alt text of the file, shown for accessibility
	 * @alpha This isn't implemented yet
	 */
	description?: string
}

export type ArrayOrSingle<T> = T | T[]

// ================================ Listener Types =================================

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
	GatewayWebhooksUpdateDispatchData
} from "discord-api-types/v10"

export const ListenerEvent = {
	...GatewayDispatchEvents,
	...ApplicationWebhookEventType
}

export type ListenerEventData = {
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

export type ValueOf<T> = T[keyof T]
