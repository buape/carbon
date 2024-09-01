import { type APIGuildTextChannel, ChannelType } from "discord-api-types/v10"
import { BaseGuildTextChannel } from "../abstracts/BaseGuildTextChannel.js"

export class GuildTextChannel extends BaseGuildTextChannel<ChannelType.GuildText> {
	type: ChannelType.GuildText = ChannelType.GuildText
	/**
	 * The default auto archive duration of threads in the channel.
	 */
	defaultAutoArchiveDuration?: number | null
	/**
	 * The default thread rate limit per user of the channel.
	 */
	defaultThreadRateLimitPerUser?: number | null

	protected setMoreSpecificData(
		data: APIGuildTextChannel<ChannelType.GuildText>
	) {
		this.defaultAutoArchiveDuration = data.default_auto_archive_duration
		this.defaultThreadRateLimitPerUser = data.default_thread_rate_limit_per_user
	}
}
