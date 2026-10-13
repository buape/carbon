---
title: BrandedAPIMessageComponentInteractionMetadata
hidden: true
---

## Signature

```ts
type BrandedAPIMessageComponentInteractionMetadata = Omit<
	BrandedAPIBaseInteractionMetadata<APIMessageComponentInteractionMetadata>,
	"interacted_message_id"
> & {
	interacted_message_id: MessageId
}
```

