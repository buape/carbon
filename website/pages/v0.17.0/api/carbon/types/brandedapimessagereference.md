---
title: BrandedAPIMessageReference
hidden: true
---

## Signature

```ts
type BrandedAPIMessageReference = Omit<
	APIMessageReference,
	"message_id" | "channel_id" | "guild_id"
> & {
	message_id?: MessageId
	channel_id: ChannelId
	guild_id?: GuildId
}
```

