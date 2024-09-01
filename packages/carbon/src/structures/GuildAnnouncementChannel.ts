import { ChannelType, Routes } from "discord-api-types/v10"
import { BaseGuildTextChannel } from "../abstracts/BaseGuildTextChannel.js"
import type { GuildTextChannel } from "./GuildTextChannel.js"

/**
 * Represents a guild announcement channel.
 */
export class GuildAnnouncementChannel extends BaseGuildTextChannel<ChannelType.GuildAnnouncement> {
	type: ChannelType.GuildAnnouncement = ChannelType.GuildAnnouncement
	protected setMoreSpecificData() {}

	async follow(targetChannel: GuildTextChannel | string) {
		await this.client.rest.put(Routes.channelFollowers(this.id), {
			body: {
				webhook_channel_id:
					typeof targetChannel === "string" ? targetChannel : targetChannel.id
			}
		})
	}
}
