---
title: BrandedAPIWebhook
hidden: true
---

## Signature

```ts
type BrandedAPIWebhook = Omit<
	APIWebhook,
	"id" | "guild_id" | "channel_id" | "application_id" | "user"
> & {
	id: WebhookId
	guild_id?: GuildId | null
	channel_id: ChannelId | null
	application_id: ApplicationId | null
	user?: BrandedAPIUser
}
```

