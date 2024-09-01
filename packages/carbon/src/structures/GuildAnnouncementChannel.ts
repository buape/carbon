import { ChannelType } from "discord-api-types/v10"
import { BaseGuildTextChannel } from "../abstracts/BaseGuildTextChannel.js"

/**
 * Represents a guild announcement channel.
 */
export class GuildAnnouncementChannel extends BaseGuildTextChannel<ChannelType.GuildAnnouncement> {
	type: ChannelType.GuildAnnouncement = ChannelType.GuildAnnouncement
	protected setMoreSpecificData() {}
}
