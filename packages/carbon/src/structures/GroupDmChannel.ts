import { type ChannelType, Routes } from "discord-api-types/v10"
import { BaseChannel } from "../abstracts/BaseChannel.js"
import type { IfPartial } from "../types/index.js"
import { type CDNUrlOptions, buildCDNUrl } from "../utils/index.js"
import { Message } from "./Message.js"
import { User } from "./User.js"

/**
 * Represents a group DM channel.
 */
export class GroupDmChannel<
	IsPartial extends boolean = false
> extends BaseChannel<ChannelType.GroupDM, IsPartial> {
	/**
	 * The name of the channel.
	 */
	get name(): IfPartial<IsPartial, string | null> {
		if (!this.rawData) return undefined as never
		return this.rawData.name
	}

	/**
	 * The recipients of the channel.
	 */
	get recipients(): IfPartial<IsPartial, User<boolean>[]> {
		if (!this.rawData) return undefined as never
		const recipients = this.rawData.recipients ?? []
		return recipients.map((u) => new User(this.client, u))
	}

	/**
	 * The ID of the application that created the channel, if it was created by a bot.
	 */
	get applicationId(): IfPartial<IsPartial, string | null> {
		if (!this.rawData) return undefined as never
		return this.rawData.application_id ?? null
	}

	/**
	 * The icon hash of the channel.
	 */
	get icon(): IfPartial<IsPartial, string | null> {
		if (!this.rawData) return undefined as never
		return this.rawData.icon ?? null
	}

	/**
	 * Get the URL of the channel's icon with default settings (png format)
	 */
	get iconUrl(): IfPartial<IsPartial, string | null> {
		if (!this.rawData) return undefined as never
		return buildCDNUrl(`https://cdn.discordapp.com/channel-icons/${this.id}`, this.icon)
	}

	/**
	 * Get the URL of the channel's icon with custom format and size options
	 * @param options Optional format and size parameters
	 * @returns The icon URL or null if no icon is set
	 */
	getIconUrl(options?: CDNUrlOptions): IfPartial<IsPartial, string | null> {
		if (!this.rawData) return undefined as never
		return buildCDNUrl(`https://cdn.discordapp.com/channel-icons/${this.id}`, this.icon, options)
	}

	/**
	 * The ID of the user who created the channel.
	 */
	get ownerId(): IfPartial<IsPartial, string | null> {
		if (!this.rawData) return undefined as never
		return this.rawData.owner_id ?? null
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
	 * Whether the channel is managed by an Oauth2 application.
	 */
	get managed(): IfPartial<IsPartial, boolean> {
		if (!this.rawData) return undefined as never
		return this.rawData.managed ?? false
	}

	/**
	 * Get the owner of the channel.
	 */
	get owner(): User<true> {
		if (!this.ownerId) throw new Error("Cannot get owner without owner ID")
		return new User<true>(this.client, this.ownerId)
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
		return new Message<true>(this.client, {
			id: this.lastMessageId,
			channelId: this.id
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
		this.setField("name", name)
	}

	// TODO: Do these even work without access token?

	// async addRecipient(user: User | string) {
	// 	await this.client.rest.put(
	// 		Routes.channelRecipient(
	// 			this.id,
	// 			typeof user === "string" ? user : user.id
	// 		)
	// 	)
	// }

	// async removeRecipient(user: User | string) {
	// 	await this.client.rest.delete(
	// 		Routes.channelRecipient(
	// 			this.id,
	// 			typeof user === "string" ? user : user.id
	// 		)
	// 	)
	// }
}
