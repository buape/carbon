---
title: MessagePayloadFile
description: The data for a file to send in an interaction
hidden: true
---

## Signature

```ts
type MessagePayloadFile = {
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
	 */
	description?: string
	/**
	 * The duration of the audio file in seconds (required for voice messages)
	 */
	duration_secs?: number
	/**
	 * Base64-encoded waveform sample data (required for voice messages)
	 */
	waveform?: string
}
```


The data for a file to send in an interaction

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| name | `string` | Yes | The name of the file that will be given to Discord |
| data | `Blob` | Yes | The data of the file in a Blob |
| description | `string` | No | The alt text of the file, shown for accessibility |
| duration_secs | `number` | No | The duration of the audio file in seconds (required for voice messages) |
| waveform | `string` | No | Base64-encoded waveform sample data (required for voice messages) |
