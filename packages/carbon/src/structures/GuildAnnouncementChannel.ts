import {
	type APIGuildTextChannel,
	type ChannelType,
	Routes
} from "discord-api-types/v10"
import { BaseGuildTextChannel } from "../abstracts/BaseGuildTextChannel.js"
import type { IfPartial } from "../types/index.js"
import type { GuildTextChannel } from "./GuildTextChannel.js"

/**
 * Represents a guild announcement channel.
 */
export class GuildAnnouncementChannel<
	IsPartial extends boolean = false
> extends BaseGuildTextChannel<ChannelType.GuildAnnouncement, IsPartial> {
	declare rawData: APIGuildTextChannel<ChannelType.GuildAnnouncement> | null

	/**
	 * The position of the channel in the channel list.
	 */
	get position(): IfPartial<IsPartial, number> {
		if (!this.rawData) return undefined as never
		return this.rawData.position
	}

	/**
	 * Set the position of the channel
	 * @param position The new position of the channel
	 */
	async setPosition(position: number) {
		await this.client.rest.patch(Routes.channel(this.id), {
			body: {
				position
			}
		})
		this.setField("position", position)
	}

	async follow(targetChannel: GuildTextChannel | string) {
		await this.client.rest.put(Routes.channelFollowers(this.id), {
			body: {
				webhook_channel_id:
					typeof targetChannel === "string" ? targetChannel : targetChannel.id
			}
		})
	}
}
