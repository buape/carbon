---
title: ChannelTypeMap
hidden: true
---

## Signature

```ts
type ChannelTypeMap = {
	[ChannelType.DM]: DmChannel<IsPartial>
	[ChannelType.GroupDM]: GroupDmChannel<IsPartial>
	[ChannelType.GuildText]: GuildTextChannel<IsPartial>
	[ChannelType.GuildVoice]: GuildVoiceChannel<IsPartial>
	[ChannelType.GuildCategory]: GuildCategoryChannel<IsPartial>
	[ChannelType.GuildAnnouncement]: GuildAnnouncementChannel<IsPartial>
	[ChannelType.AnnouncementThread]: GuildThreadChannel<
		ChannelType.AnnouncementThread,
		IsPartial
	>
	[ChannelType.PublicThread]: GuildThreadChannel<
		ChannelType.PublicThread,
		IsPartial
	>
	[ChannelType.PrivateThread]: GuildThreadChannel<
		ChannelType.PrivateThread,
		IsPartial
	>
	[ChannelType.GuildStageVoice]: GuildStageChannel<IsPartial>
	[ChannelType.GuildForum]: GuildForumChannel<IsPartial>
	[ChannelType.GuildMedia]: GuildMediaChannel<IsPartial>
}
```


### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| [ChannelType.DM] | `DmChannel<IsPartial>` | Yes |  |
| [ChannelType.GroupDM] | `GroupDmChannel<IsPartial>` | Yes |  |
| [ChannelType.GuildText] | `GuildTextChannel<IsPartial>` | Yes |  |
| [ChannelType.GuildVoice] | `GuildVoiceChannel<IsPartial>` | Yes |  |
| [ChannelType.GuildCategory] | `GuildCategoryChannel<IsPartial>` | Yes |  |
| [ChannelType.GuildAnnouncement] | `GuildAnnouncementChannel<IsPartial>` | Yes |  |
| [ChannelType.AnnouncementThread] | `GuildThreadChannel<
		ChannelType.AnnouncementThread,
		IsPartial
	>` | Yes |  |
| [ChannelType.PublicThread] | `GuildThreadChannel<
		ChannelType.PublicThread,
		IsPartial
	>` | Yes |  |
| [ChannelType.PrivateThread] | `GuildThreadChannel<
		ChannelType.PrivateThread,
		IsPartial
	>` | Yes |  |
| [ChannelType.GuildStageVoice] | `GuildStageChannel<IsPartial>` | Yes |  |
| [ChannelType.GuildForum] | `GuildForumChannel<IsPartial>` | Yes |  |
| [ChannelType.GuildMedia] | `GuildMediaChannel<IsPartial>` | Yes |  |
