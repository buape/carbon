import { type APIChannel, ChannelType } from "discord-api-types/v10"
import type { Client } from "../classes/Client.js"
import { DmChannel } from "../structures/DmChannel.js"
import { GroupDmChannel } from "../structures/GroupDmChannel.js"
import { GuildAnnouncementChannel } from "../structures/GuildAnnouncementChannel.js"
import { GuildCategoryChannel } from "../structures/GuildCategoryChannel.js"
import { GuildForumChannel } from "../structures/GuildForumChannel.js"
import { GuildMediaChannel } from "../structures/GuildMediaChannel.js"
import {
	GuildStageChannel,
	GuildVoiceChannel
} from "../structures/GuildStageOrVoiceChannel.js"
import { GuildTextChannel } from "../structures/GuildTextChannel.js"
import { GuildThreadChannel } from "../structures/GuildThreadChannel.js"
import type { AnyChannel, ChannelTypeMap } from "../types/channels.js"

export function channelFactory<T extends APIChannel>(
	client: Client,
	channelData: T
): ChannelTypeMap[T["type"]]
export function channelFactory<T extends Pick<APIChannel, "id" | "type">>(
	client: Client,
	channelData: T,
	partial: true
): ChannelTypeMap<true>[T["type"]]
export function channelFactory(
	client: Client,
	channelData: Pick<APIChannel, "id" | "type">,
	partial = false
): AnyChannel<boolean> {
	switch (channelData.type) {
		case ChannelType.DM:
			return partial
				? new DmChannel<true>(client, channelData.id, ChannelType.DM)
				: new DmChannel(
						client,
						channelData as Extract<APIChannel, { type: ChannelType.DM }>
					)
		case ChannelType.GroupDM:
			return partial
				? new GroupDmChannel<true>(client, channelData.id, ChannelType.GroupDM)
				: new GroupDmChannel(
						client,
						channelData as Extract<APIChannel, { type: ChannelType.GroupDM }>
					)
		case ChannelType.GuildText:
			return partial
				? new GuildTextChannel<true>(
						client,
						channelData.id,
						ChannelType.GuildText
					)
				: new GuildTextChannel(
						client,
						channelData as Extract<APIChannel, { type: ChannelType.GuildText }>
					)
		case ChannelType.GuildVoice:
			return partial
				? new GuildVoiceChannel<true>(
						client,
						channelData.id,
						ChannelType.GuildVoice
					)
				: new GuildVoiceChannel(
						client,
						channelData as Extract<APIChannel, { type: ChannelType.GuildVoice }>
					)
		case ChannelType.GuildCategory:
			return partial
				? new GuildCategoryChannel<true>(
						client,
						channelData.id,
						ChannelType.GuildCategory
					)
				: new GuildCategoryChannel(
						client,
						channelData as Extract<
							APIChannel,
							{ type: ChannelType.GuildCategory }
						>
					)
		case ChannelType.GuildAnnouncement:
			return partial
				? new GuildAnnouncementChannel<true>(
						client,
						channelData.id,
						ChannelType.GuildAnnouncement
					)
				: new GuildAnnouncementChannel(
						client,
						channelData as Extract<
							APIChannel,
							{ type: ChannelType.GuildAnnouncement }
						>
					)
		case ChannelType.AnnouncementThread:
			return partial
				? new GuildThreadChannel<ChannelType.AnnouncementThread, true>(
						client,
						channelData.id,
						ChannelType.AnnouncementThread
					)
				: new GuildThreadChannel(
						client,
						channelData as Extract<
							APIChannel,
							{ type: ChannelType.AnnouncementThread }
						>
					)
		case ChannelType.PublicThread:
			return partial
				? new GuildThreadChannel<ChannelType.PublicThread, true>(
						client,
						channelData.id,
						ChannelType.PublicThread
					)
				: new GuildThreadChannel(
						client,
						channelData as Extract<
							APIChannel,
							{ type: ChannelType.PublicThread }
						>
					)
		case ChannelType.PrivateThread:
			return partial
				? new GuildThreadChannel<ChannelType.PrivateThread, true>(
						client,
						channelData.id,
						ChannelType.PrivateThread
					)
				: new GuildThreadChannel(
						client,
						channelData as Extract<
							APIChannel,
							{ type: ChannelType.PrivateThread }
						>
					)
		case ChannelType.GuildStageVoice:
			return partial
				? new GuildStageChannel<true>(
						client,
						channelData.id,
						ChannelType.GuildStageVoice
					)
				: new GuildStageChannel(
						client,
						channelData as Extract<
							APIChannel,
							{ type: ChannelType.GuildStageVoice }
						>
					)
		case ChannelType.GuildForum:
			return partial
				? new GuildForumChannel<true>(
						client,
						channelData.id,
						ChannelType.GuildForum
					)
				: new GuildForumChannel(
						client,
						channelData as Extract<APIChannel, { type: ChannelType.GuildForum }>
					)
		case ChannelType.GuildMedia:
			return partial
				? new GuildMediaChannel<true>(
						client,
						channelData.id,
						ChannelType.GuildMedia
					)
				: new GuildMediaChannel(
						client,
						channelData as Extract<APIChannel, { type: ChannelType.GuildMedia }>
					)
		default:
			throw new Error(`Unsupported channel type: ${channelData.type}`)
	}
}
