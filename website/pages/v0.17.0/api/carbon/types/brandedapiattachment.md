---
title: BrandedAPIAttachment
hidden: true
---

## Signature

```ts
type BrandedAPIAttachment = Omit<
	BrandedDiscordIds<APIAttachment, AttachmentId>,
	"id" | "application"
> & {
	id: AttachmentId
	application?: BrandedDiscordIds<
		NonNullable<APIAttachment["application"]>,
		ApplicationId
	> | null
}
```

