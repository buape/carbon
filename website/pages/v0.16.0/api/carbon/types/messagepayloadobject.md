---
title: MessagePayloadObject
hidden: true
---

## Signature

```ts
type MessagePayloadObject = {
	/**
	 * The content of the message
	 */
	content?: string
	/**
	 * The embeds of the message
	 */
	embeds?: Embed[]
	/**
	 * The components to send in the message
	 */
	components?: TopLevelComponents[]
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
	/**
	 * The poll to send in the message
	 */
	poll?: PollSendPayload
	/**
	 * Whether the message should be ephemeral (shorthand for MessageFlags.Ephemeral)
	 */
	ephemeral?: boolean
	/**
	 * The stickers to send in the message
	 */
	stickers?: [string, string, string] | [string, string] | [string]
}
```


### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| content | `string` | No | The content of the message |
| embeds | `Embed[]` | No | The embeds of the message |
| components | `TopLevelComponents[]` | No | The components to send in the message |
| allowedMentions | `AllowedMentions` | No | The settings for which mentions are allowed in the message |
| flags | `number` | No | The flags for the message |
| tts | `boolean` | No | Whether the message should be TTS |
| files | `MessagePayloadFile[]` | No | The files to send in the message |
| poll | `PollSendPayload` | No | The poll to send in the message |
| ephemeral | `boolean` | No | Whether the message should be ephemeral (shorthand for MessageFlags.Ephemeral) |
| stickers | `[string, string, string] | [string, string] | [string]` | No | The stickers to send in the message |
