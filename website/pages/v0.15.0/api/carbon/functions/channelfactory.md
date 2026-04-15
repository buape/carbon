---
title: channelFactory
hidden: true
---

## Signature

```ts
const channelFactory: (client: Client, channelData: APIChannel) => {
	switch (channelData.type) {
		case ChannelType.DM:
			return new DmChannel(client, channelData)
		case ChannelType.GroupDM:
			return new GroupDmChannel(client, channelData)
		case ChannelType.GuildText:
			return new GuildTextChannel(client, channelData)
		case ChannelType.GuildVoice:
			return new GuildVoiceChannel(client, channelData)
		case ChannelType.GuildCategory:
			return new GuildCategoryChannel(client, channelData)
		case ChannelType.GuildAnnouncement:
			return new GuildAnnouncementChannel(client, channelData)
		case ChannelType.AnnouncementThread:
		case ChannelType.PublicThread:
		case ChannelType.PrivateThread:
			return new GuildThreadChannel(client, channelData)
		case ChannelType.GuildStageVoice:
			return new GuildStageChannel(client, channelData)
		case ChannelType.GuildForum:
			return new GuildForumChannel(client, channelData)
		case ChannelType.GuildMedia:
			return new GuildMediaChannel(client, channelData)
		default:
			return null
	}
}
```

