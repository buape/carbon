import type {
	APIGuildForumDefaultReactionEmoji,
	APIGuildForumTag,
	APIThreadOnlyChannel,
	ChannelType,
	SortOrderType
} from "discord-api-types/v10"
import { BaseGuildChannel } from "./BaseGuildChannel.js"

export abstract class GuildThreadOnlyChannel<
	Type extends ChannelType.GuildForum | ChannelType.GuildMedia
> extends BaseGuildChannel<Type> {
	/**
	 * The topic of the channel.
	 */
	topic?: string | null
	/**
	 * The default auto archive duration of the channel.
	 */
	defaultAutoArchiveDuration?: number | null
	/**
	 * The available tags to set on posts in the channel.
	 */
	availableTags?: APIGuildForumTag[]
	/**
	 * The default thread rate limit per user for the channel.
	 */
	defaultThreadRateLimitPerUser?: number | null
	/**
	 * The default reaction emoji for the channel.
	 */
	defaultReactionEmoji?: APIGuildForumDefaultReactionEmoji | null
	/**
	 * The default sort order for the channel, by latest activity or by creation date.
	 */
	defaultSortOrder?: SortOrderType | null

	protected setSpecificData(data: APIThreadOnlyChannel<Type>): void {
		this.topic = data.topic
		this.defaultAutoArchiveDuration = data.default_auto_archive_duration
		this.availableTags = data.available_tags
		this.defaultThreadRateLimitPerUser = data.default_thread_rate_limit_per_user
		this.defaultReactionEmoji = data.default_reaction_emoji
		this.defaultSortOrder = data.default_sort_order
		this.setMoreSpecificData(data)
	}

	protected abstract setMoreSpecificData(data: APIThreadOnlyChannel<Type>): void
}
