---
title: BrandedAPIMessage
hidden: true
---

## Signature

```ts
type BrandedAPIMessage = Omit<
	APIMessage,
	| "id"
	| "channel_id"
	| "application_id"
	| "attachments"
	| "sticker_items"
	| "message_reference"
	| "interaction_metadata"
	| "author"
	| "mentions"
	| "referenced_message"
> & {
	id: MessageId
	channel_id: ChannelId
	application_id?: ApplicationId
	attachments: BrandedAPIAttachment[]
	sticker_items?: BrandedAPIStickerItem[]
	message_reference?: BrandedAPIMessageReference
	interaction_metadata?: BrandedAPIMessageInteractionMetadata
	author: BrandedAPIUser
	mentions: BrandedAPIUser[]
	referenced_message?: BrandedAPIMessage | null
}
```

