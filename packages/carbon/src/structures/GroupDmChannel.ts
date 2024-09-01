import {
	type APIGroupDMChannel,
	ChannelType,
	Routes
} from "discord-api-types/v10"
import { BaseChannel } from "../abstracts/BaseChannel.js"
import { User } from "./User.js"
import { Message } from "./Message.js"

/**
 * Represents a group DM channel.
 */
export class GroupDmChannel extends BaseChannel<ChannelType.GroupDM> {
	/**
	 * The name of the channel.
	 */
	name?: string | null
	/**
	 * The recipients of the channel.
	 */
	recipients?: User[]
	type: ChannelType.GroupDM = ChannelType.GroupDM
	/**
	 * The ID of the application that created the channel, if it was created by a bot.
	 */
	applicationId?: string | null
	/**
	 * The icon hash of the channel.
	 */
	icon?: string | null
	/**
	 * The ID of the user who created the channel.
	 */
	ownerId?: string | null
	/**
	 * The ID of the last message sent in the channel.
	 *
	 * @remarks
	 * This might not always resolve to a message. The ID still stays a part of the channel's data, even if the message is deleted.
	 */
	lastMessageId?: string | null
	/**
	 * Whether the channel is managed by an Oauth2 application.
	 */
	managed?: boolean | null

	protected setSpecificData(data: APIGroupDMChannel) {
		this.name = data.name
		this.recipients = data.recipients?.map((x) => new User(this.client, x))
		this.applicationId = data.application_id
		this.icon = data.icon
		this.ownerId = data.owner_id
		this.lastMessageId = data.last_message_id
		this.managed = data.managed
	}

	/**
	 * Get the URL of the channel's icon.
	 */
	get iconUrl(): string | null {
		return this.icon
			? `https://cdn.discordapp.com/channel-icons/${this.id}/${this.icon}.png`
			: null
	}

	/**
	 * Get the owner of the channel.
	 */
	get owner(): User {
		if (!this.ownerId) throw new Error("Cannot get owner without owner ID")
		return new User(this.client, this.ownerId)
	}

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
	 * Set the name of the channel
	 * @param name The new name of the channel
	 */
	async setName(name: string) {
		await this.client.rest.patch(Routes.channel(this.id), {
			body: {
				name
			}
		})
		this.name = name
	}

	async addRecipient(user: User | string) {
		await this.client.rest.put(
			Routes.channelRecipient(
				this.id,
				typeof user === "string" ? user : user.id
			)
		)
		if (this.recipients)
			this.recipients.push(
				typeof user === "string" ? new User(this.client, user) : user
			)
		else
			this.recipients = [
				typeof user === "string" ? new User(this.client, user) : user
			]
	}

	async removeRecipient(user: User | string) {
		await this.client.rest.delete(
			Routes.channelRecipient(
				this.id,
				typeof user === "string" ? user : user.id
			)
		)
		if (this.recipients)
			this.recipients = this.recipients.filter(
				(x) => x.id !== (typeof user === "string" ? user : user.id)
			)
	}

	
}
