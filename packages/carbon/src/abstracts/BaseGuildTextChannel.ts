import {
	type RESTGetAPIChannelPinsResult,
	Routes,
	type APIGuildTextChannel,
	type GuildTextChannelType,
	type RESTPostAPIChannelThreadsJSONBody,
	type APIThreadChannel
} from "discord-api-types/v10"
import { BaseGuildChannel } from "./BaseGuildChannel.js"
import { Message } from "../structures/Message.js"
import { GuildThreadChannel } from "../structures/GuildThreadChannel.js"

export abstract class BaseGuildTextChannel<
	Type extends GuildTextChannelType
> extends BaseGuildChannel<Type> {
	/**
	 * The ID of the last message sent in the channel.
	 *
	 * @remarks
	 * This might not always resolve to a message. The ID still stays a part of the channel's data, even if the message is deleted.
	 */
	lastMessageId?: string | null
	/**
	 * The timestamp of the last pin in the channel.
	 */
	lastPinTimestamp?: string | null
	/**
	 * The rate limit per user for the channel, in seconds.
	 */
	rateLimitPerUser?: number | null

	protected setSpecificData(data: APIGuildTextChannel<Type>): void {
		this.lastMessageId = data.last_message_id
		this.lastPinTimestamp = data.last_pin_timestamp
		this.rateLimitPerUser = data.rate_limit_per_user
		this.setMoreSpecificData(data)
	}

	protected abstract setMoreSpecificData(data: APIGuildTextChannel<Type>): void

	/**
	 * The last message sent in the channel.
	 *
	 * @remarks
	 * This might not always resolve to a message. The ID still stays a part of the channel's data, even if the message is deleted.
	 * This will always return a partial message, so you can use {@link Message.fetch} to get the full message data.
	 *
	 */
	get lastMessage() {
		if (!this.lastMessageId) return null
		return new Message(this.client, {
			id: this.lastMessageId,
			channel_id: this.id
		})
	}

	/**
	 * Get the pinned messages in the channel
	 */
	async getPinnedMessages() {
		const msgs = (await this.client.rest.get(
			Routes.channelPins(this.id)
		)) as RESTGetAPIChannelPinsResult
		return msgs.map((x) => new Message(this.client, x))
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
