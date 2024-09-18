import type { APIGuildTextChannel, ChannelType } from "discord-api-types/v10"
import { BaseGuildTextChannel } from "../abstracts/BaseGuildTextChannel.js"
import type { IfPartial } from "../utils.js"

export class GuildTextChannel<
	IsPartial extends boolean = false
> extends BaseGuildTextChannel<ChannelType.GuildText, IsPartial> {
	declare rawData: APIGuildTextChannel<ChannelType.GuildText> | null

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
