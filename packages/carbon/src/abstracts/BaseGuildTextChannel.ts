import {
	type APIGuildTextChannel,
	type APIThreadChannel,
	type GuildTextChannelType,
	type RESTGetAPIChannelMessagesPinsQuery,
	type RESTGetAPIChannelMessagesPinsResult,
	type RESTPostAPIChannelThreadsJSONBody,
	Routes
} from "discord-api-types/v10"
import { GuildThreadChannel } from "../structures/GuildThreadChannel.js"
import { Message } from "../structures/Message.js"
import type { IfPartial } from "../types/index.js"
import { BaseGuildChannel } from "./BaseGuildChannel.js"

export abstract class BaseGuildTextChannel<
	Type extends GuildTextChannelType,
	IsPartial extends boolean = false
> extends BaseGuildChannel<Type, IsPartial> {
	declare rawData: APIGuildTextChannel<Type> | null

	/**
	 * The topic of the channel.
	 */
	get topic(): IfPartial<IsPartial, string | null> {
		if (!this.rawData) return undefined as never
		return this.rawData.topic ?? null
	}

	/**
	 * The ID of the last message sent in the channel.
	 *
	 * @remarks
	 * This might not always resolve to a message. The ID still stays a part of the channel's data, even if the message is deleted.
	 */
	get lastMessageId(): IfPartial<IsPartial, string | null> {
		if (!this.rawData) return undefined as never
		return this.rawData.last_message_id ?? null
	}
	/**
	 * The timestamp of the last pin in the channel.
	 */
	get lastPinTimestamp(): IfPartial<IsPartial, string | null> {
		if (!this.rawData) return undefined as never
		return this.rawData.last_pin_timestamp ?? null
	}
	/**
	 * The rate limit per user for the channel, in seconds.
	 */
	get rateLimitPerUser(): IfPartial<IsPartial, number | undefined> {
		if (!this.rawData) return undefined as never
		return this.rawData.rate_limit_per_user
	}

	/**
	 * The last message sent in the channel.
	 *
	 * @remarks
	 * This might not always resolve to a message. The ID still stays a part of the channel's data, even if the message is deleted.
	 * This will always return a partial message, so you can use {@link Message.fetch} to get the full message data.
	 *
	 */
	get lastMessage(): IfPartial<IsPartial, Message<true> | null> {
		if (!this.rawData) return undefined as never
		if (!this.lastMessageId) return null
		return new Message<true>(this.client, {
			id: this.lastMessageId,
			channelId: this.id
		})
	}

	/**
	 * Get the pinned messages in the channel using paginated API
	 * @param options Optional pagination parameters
	 */
	async getChannelPins(options?: RESTGetAPIChannelMessagesPinsQuery) {
		const queryParams: Record<string, string> = {}
		if (options?.before) queryParams.before = options.before
		if (options?.limit) queryParams.limit = options.limit.toString()

		const result = (await this.client.rest.get(
			Routes.channelMessagesPins(this.id),
			Object.keys(queryParams).length > 0 ? queryParams : undefined
		)) as RESTGetAPIChannelMessagesPinsResult

		return {
			pins: result.items.map((pin) => ({
				pinnedAt: pin.pinned_at,
				message: new Message(this.client, pin.message)
			})),
			hasMore: result.has_more
		}
	}

	/**
	 * Start a thread without an associated start message.
	 * If you want to start a thread with a start message, use {@link Message.startThread}
	 */
	async startThread(data: RESTPostAPIChannelThreadsJSONBody) {
		const thread = (await this.client.rest.post(Routes.threads(this.id), {
			body: { ...data }
		})) as APIThreadChannel
		return new GuildThreadChannel(this.client, thread)
	}
}
