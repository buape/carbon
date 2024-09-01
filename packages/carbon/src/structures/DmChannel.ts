import {
	type APIDMChannel,
	type APIMessage,
	ChannelType,
	Routes
} from "discord-api-types/v10"
import { BaseChannel } from "../abstracts/BaseChannel.js"

/**
 * Represents a DM between two users.
 */
export class DmChannel extends BaseChannel<ChannelType.DM> {
	/**
	 * The name of the channel. This is always null for DM channels.
	 */
	name?: null = null
	type: ChannelType.DM = ChannelType.DM

	protected setSpecificData(data: APIDMChannel) {
		this.name = data.name
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
