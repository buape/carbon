---
title: ListenerEvent
hidden: true
---

## Signature

```ts
const ListenerEvent: {
	...GatewayEvent,
	...WebhookEvent,
	GuildAvailable: "GUILD_AVAILABLE" as const,
	GuildUnavailable: "GUILD_UNAVAILABLE" as const
}
```

