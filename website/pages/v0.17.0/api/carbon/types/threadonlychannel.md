---
title: ThreadOnlyChannel
hidden: true
---

## Signature

```ts
type ThreadOnlyChannel = ChannelByType<
		Extract<
			APIChannel["type"],
			ChannelType.GuildForum | ChannelType.GuildMedia
		>,
		IsPartial
	>
```

