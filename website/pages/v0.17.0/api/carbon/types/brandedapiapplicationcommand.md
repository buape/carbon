---
title: BrandedAPIApplicationCommand
hidden: true
---

## Signature

```ts
type BrandedAPIApplicationCommand = Omit<
	BrandedDiscordIds<APIApplicationCommand, ApplicationCommandId>,
	"id" | "application_id" | "guild_id"
> & {
	id: ApplicationCommandId
	application_id: ApplicationId
	guild_id?: GuildId
}
```

