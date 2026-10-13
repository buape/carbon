---
title: BrandedAPIApplicationCommandInteractionMetadata
hidden: true
---

## Signature

```ts
type BrandedAPIApplicationCommandInteractionMetadata = Omit<
	BrandedAPIBaseInteractionMetadata<APIApplicationCommandInteractionMetadata>,
	"target_user" | "target_message_id"
> & {
	target_user?: BrandedAPIUser
	target_message_id?: MessageId
}
```

