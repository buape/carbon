---
title: GuildMember
hidden: true
---

## class `GuildMember`

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| _rawData | `APIGuildMemberPartialVoice | null` | Yes |  |
| setData | `(data: typeof this._rawData) => void` | Yes |  |
| setField | `(key: keyof APIGuildMemberPartialVoice, value: unknown) => void` | Yes |  |
| guild | `Guild<IsGuildPartial>` | Yes | The guild object of the member. |
| user | `User` | Yes | The user object of the member. |
| getAvatarUrl | `(options: CDNUrlOptions) => IfPartial<IsPartial, string | null>` | Yes | Get the URL of the member's guild-specific avatar with custom format and size options @param options Optional format and size parameters @returns The avatar URL or null if no avatar is set |
| getVoiceState | `() => Promise<VoiceState | null>` | Yes |  |
| getPermissions | `() => Promise<IfPartial<IsPartial, bigint[]>>` | Yes |  |
| setNickname | `(nickname: string | null, reason: string) => Promise<void>` | Yes | Set the nickname of the member |
| setMemberData | `(data: {
			/**
			 * Data URI base64 encoded banner image
			 */
			banner?: string | null
			bio?: string | null
			/**
			 * Data URI base64 encoded avatar image
			 */
			avatar?: string | null
		}, reason: string) => Promise<void>` | Yes | Set the member's guild-specific data This will only work if the current member is the bot itself, and will throw an error if it is not |
| addRole | `(roleId: string, reason: string) => Promise<void>` | Yes | Add a role to the member |
| removeRole | `(roleId: string, reason: string) => Promise<void>` | Yes | Remove a role from the member |
| kick | `(reason: string) => Promise<void>` | Yes | Kick the member from the guild |
| ban | `(options: { reason?: string; deleteMessageDays?: number }) => Promise<void>` | Yes | Ban the member from the guild |
| muteMember | `(reason: string) => Promise<void>` | Yes | Mute a member in voice channels |
| unmuteMember | `(reason: string) => Promise<void>` | Yes | Unmute a member in voice channels |
| deafenMember | `(reason: string) => Promise<void>` | Yes | Deafen a member in voice channels |
| undeafenMember | `(reason: string) => Promise<void>` | Yes | Undeafen a member in voice channels |
| timeoutMember | `(communicationDisabledUntil: string, reason: string) => Promise<void>` | Yes | Set or remove a timeout for a member in the guild |
| fetch | `() => Promise<GuildMember<false, true>>` | Yes |  |
