import {
	type APIGuildTextChannel,
	type ChannelType,
	Routes
} from "discord-api-types/v10"
import { BaseGuildTextChannel } from "../abstracts/BaseGuildTextChannel.js"
import type { IfPartial } from "../types/index.js"

export class GuildTextChannel<
	IsPartial extends boolean = false
> extends BaseGuildTextChannel<ChannelType.GuildText, IsPartial> {
	declare rawData: APIGuildTextChannel<ChannelType.GuildText> | null

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

	/**
	 * The default auto archive duration of threads in the channel.
	 */
	get defaultAutoArchiveDuration(): IfPartial<IsPartial, number | null> {
		if (!this.rawData) return undefined as never
		return this.rawData.default_auto_archive_duration ?? null
	}

	/**
	 * The default thread rate limit per user of the channel.
	 */
	get defaultThreadRateLimitPerUser(): IfPartial<IsPartial, number | null> {
		if (!this.rawData) return undefined as never
		return this.rawData.default_thread_rate_limit_per_user ?? null
	}
}
