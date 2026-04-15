---
title: VoiceState
hidden: true
---

## Signature

```ts
type VoiceState = {
	guildId?: string
	channelId: string | null
	userId: string
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
| guildId | `string` | No |  |
| channelId | `string | null` | Yes |  |
| userId | `string` | Yes |  |
| sessionId | `string` | Yes |  |
| deaf | `boolean` | Yes |  |
| mute | `boolean` | Yes |  |
| selfDeaf | `boolean` | Yes |  |
| selfMute | `boolean` | Yes |  |
| selfStream | `boolean` | Yes |  |
| selfVideo | `boolean` | Yes |  |
| suppress | `boolean` | Yes |  |
| requestToSpeakTimestamp | `string | null` | Yes |  |
