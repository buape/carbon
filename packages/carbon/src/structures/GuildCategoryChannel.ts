import type { ChannelType } from "discord-api-types/v10"
import { BaseGuildChannel } from "../abstracts/BaseGuildChannel.js"

/**
 * Represents a guild category channel.
 */
export class GuildCategoryChannel extends BaseGuildChannel<ChannelType.GuildCategory> {
	protected setSpecificData() {}

	/**
	 * You cannot send a message to a category channel, so this method throws an error
	 */
	override async send(): Promise<void> {
		throw new Error("Category channels cannot be sent to")
	}
}
