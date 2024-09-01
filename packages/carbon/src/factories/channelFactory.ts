import { type APIChannel, ChannelType } from "discord-api-types/v10"
import { DmChannel } from "../structures/DmChannel.js"
import { GuildAnnouncementChannel } from "../structures/GuildAnnouncementChannel.js"
import { GuildThreadChannel } from "../structures/GuildThreadChannel.js"
import { GroupDmChannel } from "../structures/GroupDmChannel.js"
import { GuildCategoryChannel } from "../structures/GuildCategoryChannel.js"
import { GuildForumChannel } from "../structures/GuildForumChannel.js"
import { GuildMediaChannel } from "../structures/GuildMediaChannel.js"
import {
	GuildVoiceChannel,
	GuildStageChannel
} from "../structures/GuildStageOrVoiceChannel.js"
import { GuildTextChannel } from "../structures/GuildTextChannel.js"
import type { Client } from "../classes/Client.js"

/**
 * This factory is used to create a channel from API data, based on the channel type.
 */
export const channelFactory = (client: Client, channel: APIChannel) => {
	switch (channel.type) {
		case ChannelType.GuildText: {
			return new GuildTextChannel(client, channel)
		}
		case ChannelType.DM: {
			return new DmChannel(client, channel)
		}
		case ChannelType.GuildVoice: {
			return new GuildVoiceChannel(client, channel)
		}
		case ChannelType.GroupDM: {
			return new GroupDmChannel(client, channel)
		}
		case ChannelType.GuildCategory: {
			return new GuildCategoryChannel(client, channel)
		}
		case ChannelType.GuildAnnouncement: {
			return new GuildAnnouncementChannel(client, channel)
		}
		case ChannelType.AnnouncementThread: {
			return new GuildThreadChannel(client, channel)
		}
		case ChannelType.PublicThread: {
			return new GuildThreadChannel(client, channel)
		}
		case ChannelType.PrivateThread: {
			return new GuildThreadChannel(client, channel)
		}
		case ChannelType.GuildStageVoice: {
			return new GuildStageChannel(client, channel)
		}
		case ChannelType.GuildForum: {
			return new GuildForumChannel(client, channel)
		}
		case ChannelType.GuildMedia: {
			return new GuildMediaChannel(client, channel)
		}
		default:
			// @ts-expect-error 2339 "Type 'never' is not assignable to type 'ChannelType'"
			throw new Error(`Unknown channel type: ${channel.type}`)
	}
}
