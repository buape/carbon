---
title: BrandedAPIModalSubmitInteractionMetadata
hidden: true
---

## Signature

```ts
type BrandedAPIModalSubmitInteractionMetadata = Omit<
	BrandedAPIBaseInteractionMetadata<APIModalSubmitInteractionMetadata>,
	"triggering_interaction_metadata"
> & {
	triggering_interaction_metadata:
		| BrandedAPIApplicationCommandInteractionMetadata
		| BrandedAPIMessageComponentInteractionMetadata
}
```

