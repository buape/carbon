import { type APIDMChannel, ChannelType } from "discord-api-types/v10"
import { BaseChannel } from "../abstracts/BaseChannel.js"

/**
 * Represents a DM between two users.
 */
export class DmChannel extends BaseChannel<ChannelType.DM> {
	/**
	 * The name of the channel. This is always null for DM channels.
	 */
	name = null
	type: ChannelType.DM = ChannelType.DM

	protected setSpecificData(data: APIDMChannel) {
		this.name = data.name
	}
}
