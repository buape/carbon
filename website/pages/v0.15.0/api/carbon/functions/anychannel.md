---
title: AnyChannel
hidden: true
---

## Signature

```ts
type AnyChannel = | DmChannel
	| GroupDmChannel
	| GuildTextChannel
	| GuildVoiceChannel
	| GuildStageChannel
	| GuildCategoryChannel
	| GuildAnnouncementChannel
	| GuildThreadChannel<ThreadChannelType>
	| GuildForumChannel
	| GuildMediaChannel
```

