import type {
	APIGuildForumDefaultReactionEmoji,
	APIGuildForumTag,
	APIMessage,
	APIThreadOnlyChannel,
	ChannelType,
	SortOrderType
} from "discord-api-types/v10"
import { GuildThreadChannel } from "../structures/GuildThreadChannel.js"
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

	/**
	 * You cannot send a message directly to a forum or media channel, so this method throws an error.
	 * Use {@link GuildThreadChannel.send} instead, or the alias {@link GuildThreadOnlyChannel.sendToPost} instead, to send a message to the channel's posts.
	 */
	override async send(): Promise<void> {
		throw new Error(
			"You cannot send a message directly to a forum or media channel. Use GuildThreadChannel.send instead, or the alias GuildThreadOnlyChannel.sendToPost instead, to send a message to the channel's posts."
		)
	}

	/**
	 * Send a message to a post in the channel
	 * @remarks
	 * This is an alias for {@link GuildThreadChannel.send} that will fetch the channel, but if you already have the channel, you can use {@link GuildThreadChannel.send} instead.
	 */
	async sendToPost(message: APIMessage, postId: string): Promise<void> {
		const channel = new GuildThreadChannel(this.client, postId)
		await channel.send(message)
	}
}
