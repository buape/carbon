---
title: ThreadChannel
hidden: true
---

## Signature

```ts
type ThreadChannel = ChannelByType<
	Extract<APIChannel["type"], ThreadChannelType>,
	IsPartial
>
```

