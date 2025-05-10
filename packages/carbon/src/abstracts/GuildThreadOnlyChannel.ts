import type {
	APIGuildForumDefaultReactionEmoji,
	APIGuildForumTag,
	APIThreadOnlyChannel,
	ChannelType,
	SortOrderType,
	ThreadChannelType
} from "discord-api-types/v10"
import { GuildThreadChannel } from "../structures/GuildThreadChannel.js"
import type { Message } from "../structures/Message.js"
import type { MessagePayload } from "../types/index.js"
import type { IfPartial } from "../types/index.js"
import { BaseGuildChannel } from "./BaseGuildChannel.js"
export abstract class GuildThreadOnlyChannel<
	Type extends ChannelType.GuildForum | ChannelType.GuildMedia,
	IsPartial extends boolean = false
> extends BaseGuildChannel<Type, IsPartial> {
	declare rawData: APIThreadOnlyChannel<Type> | null

	/**
	 * The topic of the channel.
	 */
	get topic(): IfPartial<IsPartial, string | null> {
		if (!this.rawData) return undefined as never
		return this.rawData.topic ?? null
	}

	/**
	 * The default auto archive duration of the channel.
	 */
	get defaultAutoArchiveDuration(): IfPartial<IsPartial, number | null> {
		if (!this.rawData) return undefined as never
		return this.rawData.default_auto_archive_duration ?? null
	}

	/**
	 * The default thread rate limit per user for the channel.
	 */
	get defaultThreadRateLimitPerUser(): IfPartial<IsPartial, number | null> {
		if (!this.rawData) return undefined as never
		return this.rawData.default_thread_rate_limit_per_user ?? null
	}

	/**
	 * The available tags to set on posts in the channel.
	 */
	get availableTags(): IfPartial<IsPartial, APIGuildForumTag[]> {
		if (!this.rawData) return undefined as never
		return this.rawData.available_tags ?? []
	}

	/**
	 * The default reaction emoji for the channel.
	 */
	get defaultReactionEmoji(): IfPartial<
		IsPartial,
		APIGuildForumDefaultReactionEmoji | null
	> {
		if (!this.rawData) return undefined as never
		return this.rawData.default_reaction_emoji
	}

	/**
	 * The default sort order for the channel, by latest activity or by creation date.
	 */
	get defaultSortOrder(): IfPartial<IsPartial, SortOrderType | null> {
		if (!this.rawData) return undefined as never
		return this.rawData.default_sort_order
	}

	/**
	 * You cannot send a message directly to a forum or media channel, so this method throws an error.
	 * Use {@link GuildThreadChannel.send} instead, or the alias {@link GuildThreadOnlyChannel.sendToPost} instead, to send a message to the channel's posts.
	 */
	override async send(): Promise<never> {
		throw new Error(
			"You cannot send a message directly to a forum or media channel. Use GuildThreadChannel.send instead, or the alias GuildThreadOnlyChannel.sendToPost instead, to send a message to the channel's posts."
		)
	}

	/**
	 * Send a message to a post in the channel
	 * @remarks
	 * This is an alias for {@link GuildThreadChannel.send} that will fetch the channel, but if you already have the channel, you can use {@link GuildThreadChannel.send} instead.
	 */
	async sendToPost(message: MessagePayload, postId: string): Promise<Message> {
		const channel = new GuildThreadChannel<ThreadChannelType, true>(
			this.client,
			postId
		)
		return await channel.send(message)
	}
}
