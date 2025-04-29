import {
	type APIDMChannel,
	type ChannelType,
	Routes
} from "discord-api-types/v10"
import { BaseChannel } from "../abstracts/BaseChannel.js"
import type { IfPartial, MessagePayload } from "../types/index.js"
import { serializePayload } from "../utils/index.js"

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
		return null
	}

	/**
	 * Send a message to the channel
	 */
	async send(message: MessagePayload) {
		this.client.rest.post(Routes.channelMessages(this.id), {
			body: serializePayload(message)
		})
	}
}
