---
title: ListenerEventRawData
hidden: true
---

## Signature

```ts
type ListenerEventRawData = {
	[ListenerEvent.GuildAvailable]: GatewayGuildCreateDispatchData
	[ListenerEvent.GuildUnavailable]: GatewayGuildDeleteDispatchData
	[ListenerEvent.ApplicationAuthorized]: APIWebhookEventApplicationAuthorizedData
	[ListenerEvent.ApplicationDeauthorized]: APIWebhookEventApplicationDeauthorizedData
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
	[ListenerEvent.MessagePollVoteAdd]: GatewayMessagePollVoteDispatchData
	[ListenerEvent.MessagePollVoteRemove]: GatewayMessagePollVoteDispatchData
	[ListenerEvent.MessageReactionAdd]: GatewayMessageReactionAddDispatchData
	[ListenerEvent.MessageReactionRemove]: GatewayMessageReactionRemoveDispatchData
	[ListenerEvent.MessageReactionRemoveAll]: GatewayMessageReactionRemoveAllDispatchData
	[ListenerEvent.MessageReactionRemoveEmoji]: GatewayMessageReactionRemoveEmojiDispatchData
	[ListenerEvent.MessageUpdate]: GatewayMessageUpdateDispatchData
	[ListenerEvent.PresenceUpdate]: GatewayPresenceUpdateDispatchData
	[ListenerEvent.RateLimited]: GatewayRateLimitedDispatchData
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
	[ListenerEvent.ThreadMembersUpdate]: GatewayThreadMembersUpdateDispatchData
	[ListenerEvent.ThreadMemberUpdate]: GatewayThreadMemberUpdateDispatchData
	[ListenerEvent.ThreadUpdate]: GatewayThreadUpdateDispatchData
	[ListenerEvent.TypingStart]: GatewayTypingStartDispatchData
	[ListenerEvent.UserUpdate]: GatewayUserUpdateDispatchData
	[ListenerEvent.VoiceChannelEffectSend]: GatewayVoiceChannelEffectSendDispatchData
	[ListenerEvent.VoiceServerUpdate]: GatewayVoiceServerUpdateDispatchData
	[ListenerEvent.VoiceStateUpdate]: GatewayVoiceStateUpdateDispatchData
	[ListenerEvent.WebhooksUpdate]: GatewayWebhooksUpdateDispatchData
}
```


### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| [ListenerEvent.GuildAvailable] | `GatewayGuildCreateDispatchData` | Yes |  |
| [ListenerEvent.GuildUnavailable] | `GatewayGuildDeleteDispatchData` | Yes |  |
| [ListenerEvent.ApplicationAuthorized] | `APIWebhookEventApplicationAuthorizedData` | Yes |  |
| [ListenerEvent.ApplicationDeauthorized] | `APIWebhookEventApplicationDeauthorizedData` | Yes |  |
| [ListenerEvent.EntitlementCreate] | `APIWebhookEventEntitlementCreateData` | Yes |  |
| [ListenerEvent.QuestUserEnrollment] | `APIWebhookEventQuestUserEnrollmentData` | Yes |  |
| [ListenerEvent.ApplicationCommandPermissionsUpdate] | `GatewayApplicationCommandPermissionsUpdateDispatchData` | Yes |  |
| [ListenerEvent.AutoModerationActionExecution] | `GatewayAutoModerationActionExecutionDispatchData` | Yes |  |
| [ListenerEvent.AutoModerationRuleCreate] | `GatewayAutoModerationRuleCreateDispatchData` | Yes |  |
| [ListenerEvent.AutoModerationRuleDelete] | `GatewayAutoModerationRuleDeleteDispatchData` | Yes |  |
| [ListenerEvent.AutoModerationRuleUpdate] | `GatewayAutoModerationRuleUpdateDispatchData` | Yes |  |
| [ListenerEvent.ChannelCreate] | `GatewayChannelCreateDispatchData` | Yes |  |
| [ListenerEvent.ChannelDelete] | `GatewayChannelDeleteDispatchData` | Yes |  |
| [ListenerEvent.ChannelPinsUpdate] | `GatewayChannelPinsUpdateDispatchData` | Yes |  |
| [ListenerEvent.ChannelUpdate] | `GatewayChannelUpdateDispatchData` | Yes |  |
| [ListenerEvent.EntitlementDelete] | `GatewayEntitlementDeleteDispatchData` | Yes |  |
| [ListenerEvent.EntitlementUpdate] | `GatewayEntitlementUpdateDispatchData` | Yes |  |
| [ListenerEvent.GuildAuditLogEntryCreate] | `GatewayGuildAuditLogEntryCreateDispatchData` | Yes |  |
| [ListenerEvent.GuildBanAdd] | `GatewayGuildBanAddDispatchData` | Yes |  |
| [ListenerEvent.GuildBanRemove] | `GatewayGuildBanRemoveDispatchData` | Yes |  |
| [ListenerEvent.GuildCreate] | `GatewayGuildCreateDispatchData` | Yes |  |
| [ListenerEvent.GuildDelete] | `GatewayGuildDeleteDispatchData` | Yes |  |
| [ListenerEvent.GuildEmojisUpdate] | `GatewayGuildEmojisUpdateDispatchData` | Yes |  |
| [ListenerEvent.GuildIntegrationsUpdate] | `GatewayGuildIntegrationsUpdateDispatchData` | Yes |  |
| [ListenerEvent.GuildMemberAdd] | `GatewayGuildMemberAddDispatchData` | Yes |  |
| [ListenerEvent.GuildMemberRemove] | `GatewayGuildMemberRemoveDispatchData` | Yes |  |
| [ListenerEvent.GuildMemberUpdate] | `GatewayGuildMemberUpdateDispatchData` | Yes |  |
| [ListenerEvent.GuildMembersChunk] | `GatewayGuildMembersChunkDispatchData` | Yes |  |
| [ListenerEvent.GuildRoleCreate] | `GatewayGuildRoleCreateDispatchData` | Yes |  |
| [ListenerEvent.GuildRoleDelete] | `GatewayGuildRoleDeleteDispatchData` | Yes |  |
| [ListenerEvent.GuildRoleUpdate] | `GatewayGuildRoleUpdateDispatchData` | Yes |  |
| [ListenerEvent.GuildScheduledEventCreate] | `GatewayGuildScheduledEventCreateDispatchData` | Yes |  |
| [ListenerEvent.GuildScheduledEventDelete] | `GatewayGuildScheduledEventDeleteDispatchData` | Yes |  |
| [ListenerEvent.GuildScheduledEventUpdate] | `GatewayGuildScheduledEventUpdateDispatchData` | Yes |  |
| [ListenerEvent.GuildScheduledEventUserAdd] | `GatewayGuildScheduledEventUserAddDispatchData` | Yes |  |
| [ListenerEvent.GuildScheduledEventUserRemove] | `GatewayGuildScheduledEventUserRemoveDispatchData` | Yes |  |
| [ListenerEvent.GuildSoundboardSoundCreate] | `GatewayGuildSoundboardSoundCreateDispatchData` | Yes |  |
| [ListenerEvent.GuildSoundboardSoundDelete] | `GatewayGuildSoundboardSoundDeleteDispatchData` | Yes |  |
| [ListenerEvent.GuildSoundboardSoundUpdate] | `GatewayGuildSoundboardSoundUpdateDispatchData` | Yes |  |
| [ListenerEvent.GuildSoundboardSoundsUpdate] | `GatewayGuildSoundboardSoundsUpdateDispatchData` | Yes |  |
| [ListenerEvent.SoundboardSounds] | `GatewayGuildSoundboardSoundsUpdateDispatchData` | Yes |  |
| [ListenerEvent.GuildStickersUpdate] | `GatewayGuildStickersUpdateDispatchData` | Yes |  |
| [ListenerEvent.GuildUpdate] | `GatewayGuildUpdateDispatchData` | Yes |  |
| [ListenerEvent.IntegrationCreate] | `GatewayIntegrationCreateDispatchData` | Yes |  |
| [ListenerEvent.IntegrationDelete] | `GatewayIntegrationDeleteDispatchData` | Yes |  |
| [ListenerEvent.IntegrationUpdate] | `GatewayIntegrationUpdateDispatchData` | Yes |  |
| [ListenerEvent.InteractionCreate] | `GatewayInteractionCreateDispatchData` | Yes |  |
| [ListenerEvent.InviteCreate] | `GatewayInviteCreateDispatchData` | Yes |  |
| [ListenerEvent.InviteDelete] | `GatewayInviteDeleteDispatchData` | Yes |  |
| [ListenerEvent.MessageCreate] | `GatewayMessageCreateDispatchData` | Yes |  |
| [ListenerEvent.MessageDelete] | `GatewayMessageDeleteDispatchData` | Yes |  |
| [ListenerEvent.MessageDeleteBulk] | `GatewayMessageDeleteBulkDispatchData` | Yes |  |
| [ListenerEvent.MessagePollVoteAdd] | `GatewayMessagePollVoteDispatchData` | Yes |  |
| [ListenerEvent.MessagePollVoteRemove] | `GatewayMessagePollVoteDispatchData` | Yes |  |
| [ListenerEvent.MessageReactionAdd] | `GatewayMessageReactionAddDispatchData` | Yes |  |
| [ListenerEvent.MessageReactionRemove] | `GatewayMessageReactionRemoveDispatchData` | Yes |  |
| [ListenerEvent.MessageReactionRemoveAll] | `GatewayMessageReactionRemoveAllDispatchData` | Yes |  |
| [ListenerEvent.MessageReactionRemoveEmoji] | `GatewayMessageReactionRemoveEmojiDispatchData` | Yes |  |
| [ListenerEvent.MessageUpdate] | `GatewayMessageUpdateDispatchData` | Yes |  |
| [ListenerEvent.PresenceUpdate] | `GatewayPresenceUpdateDispatchData` | Yes |  |
| [ListenerEvent.RateLimited] | `GatewayRateLimitedDispatchData` | Yes |  |
| [ListenerEvent.Ready] | `GatewayReadyDispatchData` | Yes |  |
| [ListenerEvent.Resumed] | `GatewayResumedDispatch["d"]` | Yes |  |
| [ListenerEvent.StageInstanceCreate] | `GatewayStageInstanceCreateDispatchData` | Yes |  |
| [ListenerEvent.StageInstanceDelete] | `GatewayStageInstanceDeleteDispatchData` | Yes |  |
| [ListenerEvent.StageInstanceUpdate] | `GatewayStageInstanceUpdateDispatchData` | Yes |  |
| [ListenerEvent.SubscriptionCreate] | `GatewaySubscriptionCreateDispatchData` | Yes |  |
| [ListenerEvent.SubscriptionDelete] | `GatewaySubscriptionDeleteDispatchData` | Yes |  |
| [ListenerEvent.SubscriptionUpdate] | `GatewaySubscriptionUpdateDispatchData` | Yes |  |
| [ListenerEvent.ThreadCreate] | `GatewayThreadCreateDispatchData` | Yes |  |
| [ListenerEvent.ThreadDelete] | `GatewayThreadDeleteDispatchData` | Yes |  |
| [ListenerEvent.ThreadListSync] | `GatewayThreadListSyncDispatchData` | Yes |  |
| [ListenerEvent.ThreadMembersUpdate] | `GatewayThreadMembersUpdateDispatchData` | Yes |  |
| [ListenerEvent.ThreadMemberUpdate] | `GatewayThreadMemberUpdateDispatchData` | Yes |  |
| [ListenerEvent.ThreadUpdate] | `GatewayThreadUpdateDispatchData` | Yes |  |
| [ListenerEvent.TypingStart] | `GatewayTypingStartDispatchData` | Yes |  |
| [ListenerEvent.UserUpdate] | `GatewayUserUpdateDispatchData` | Yes |  |
| [ListenerEvent.VoiceChannelEffectSend] | `GatewayVoiceChannelEffectSendDispatchData` | Yes |  |
| [ListenerEvent.VoiceServerUpdate] | `GatewayVoiceServerUpdateDispatchData` | Yes |  |
| [ListenerEvent.VoiceStateUpdate] | `GatewayVoiceStateUpdateDispatchData` | Yes |  |
| [ListenerEvent.WebhooksUpdate] | `GatewayWebhooksUpdateDispatchData` | Yes |  |
