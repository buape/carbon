---
title: VoiceState
hidden: true
---

## Signature

```ts
type VoiceState = {
	guildId?: GuildId
	channelId: ChannelId | null
	userId: UserId
	sessionId: string
	deaf: boolean
	mute: boolean
	selfDeaf: boolean
	selfMute: boolean
	selfStream: boolean
	selfVideo: boolean
	suppress: boolean
	requestToSpeakTimestamp: string | null
}
```


### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| guildId | `GuildId` | No |  |
| channelId | `ChannelId | null` | Yes |  |
| userId | `UserId` | Yes |  |
| sessionId | `string` | Yes |  |
| deaf | `boolean` | Yes |  |
| mute | `boolean` | Yes |  |
| selfDeaf | `boolean` | Yes |  |
| selfMute | `boolean` | Yes |  |
| selfStream | `boolean` | Yes |  |
| selfVideo | `boolean` | Yes |  |
| suppress | `boolean` | Yes |  |
| requestToSpeakTimestamp | `string | null` | Yes |  |
