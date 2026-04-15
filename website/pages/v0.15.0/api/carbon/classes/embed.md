---
title: Embed
description: Represents an embed in a message.
hidden: true
---

## class `Embed`

Represents an embed in a message.

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| title | `string` | No | The title of the embed |
| description | `string` | No | The description of the embed |
| url | `string` | No | The URL of the embed |
| timestamp | `string` | No | The timestamp of the embed |
| color | `number` | No | The color of the embed |
| footer | `{
		text: string
		icon_url?: string
	}` | No | The footer of the embed |
| image | `string` | No | The image URL of the embed |
| thumbnail | `string` | No | The thumbnail URL of the embed |
| author | `{
		name: string
		url?: string
		icon_url?: string
	}` | No |  |
| fields | `{
		name: string
		value: string
		inline?: boolean
	}[]` | No |  |
| serialize | `() => APIEmbed` | Yes | Serialize the embed to an API embed @internal |
