---
title: SendableChannel
hidden: true
---

## Signature

```ts
type SendableChannel = ChannelByType<
	Exclude<
		APIChannel["type"],
		ChannelType.GuildCategory | ChannelType.GuildForum | ChannelType.GuildMedia
	>,
	IsPartial
>
```

