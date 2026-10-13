---
title: DMBasedChannel
hidden: true
---

## Signature

```ts
type DMBasedChannel = ChannelByType<
	Exclude<APIChannel["type"], GuildChannelType>,
	IsPartial
>
```

