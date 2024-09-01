import type {
	APIGuildTextChannel,
	GuildTextChannelType
} from "discord-api-types/v10"
import { BaseGuildChannel } from "./BaseGuildChannel.js"
import { Message } from "../structures/Message.js"

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
}
