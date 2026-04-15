import {
	type APIChannel,
	ChannelType,
	type GuildChannelType,
	type ThreadChannelType
} from "discord-api-types/v10"
import type { DmChannel } from "../structures/DmChannel.js"
import type { GroupDmChannel } from "../structures/GroupDmChannel.js"
import type { GuildAnnouncementChannel } from "../structures/GuildAnnouncementChannel.js"
import type { GuildCategoryChannel } from "../structures/GuildCategoryChannel.js"
import type { GuildForumChannel } from "../structures/GuildForumChannel.js"
import type { GuildMediaChannel } from "../structures/GuildMediaChannel.js"
import type {
	GuildStageChannel,
	GuildVoiceChannel
} from "../structures/GuildStageOrVoiceChannel.js"
import type { GuildTextChannel } from "../structures/GuildTextChannel.js"
import type { GuildThreadChannel } from "../structures/GuildThreadChannel.js"

export type ChannelTypeMap<IsPartial extends boolean = false> = {
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

type ChannelByType<
	Type extends APIChannel["type"],
	IsPartial extends boolean = false
> = ChannelTypeMap<IsPartial>[Type]

export type AnyChannel<IsPartial extends boolean = false> = ChannelByType<
	APIChannel["type"],
	IsPartial
>

export type DMBasedChannel<IsPartial extends boolean = false> = ChannelByType<
	Exclude<APIChannel["type"], GuildChannelType>,
	IsPartial
>

export type GuildBasedChannel<IsPartial extends boolean = false> =
	ChannelByType<Extract<APIChannel["type"], GuildChannelType>, IsPartial>

export type ThreadChannel<IsPartial extends boolean = false> = ChannelByType<
	Extract<APIChannel["type"], ThreadChannelType>,
	IsPartial
>

export type ThreadOnlyChannel<IsPartial extends boolean = false> =
	ChannelByType<
		Extract<
			APIChannel["type"],
			ChannelType.GuildForum | ChannelType.GuildMedia
		>,
		IsPartial
	>

export type SendableChannel<IsPartial extends boolean = false> = ChannelByType<
	Exclude<
		APIChannel["type"],
		ChannelType.GuildCategory | ChannelType.GuildForum | ChannelType.GuildMedia
	>,
	IsPartial
>
