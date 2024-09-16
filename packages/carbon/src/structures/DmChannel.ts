import {
	type APIDMChannel,
	type APIMessage,
	type ChannelType,
	Routes
} from "discord-api-types/v10"
import { BaseChannel } from "../abstracts/BaseChannel.js"
import type { IfPartial } from "../utils.js"

/**
 * Represents a DM between two users.
 */
export class DmChannel<IsPartial extends boolean = false> extends BaseChannel<
	ChannelType.DM,
	IsPartial
> {
	declare rawData: APIDMChannel | null

	/**
	 * The name of the channel. This is always null for DM channels.
	 */
	get name(): IfPartial<IsPartial, null> {
		if (!this.rawData) return undefined as never
		return null as never
	}

	/**
	 * Send a message to the channel
	 */
	async send(message: APIMessage) {
		this.client.rest.post(Routes.channelMessages(this.id), {
			body: { ...message }
		})
	}
}
