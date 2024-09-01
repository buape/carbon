import type { ChannelType } from "discord-api-types/v10"
import { BaseGuildChannel } from "../abstracts/BaseGuildChannel.js"

/**
 * Represents a guild category channel.
 */
export class GuildCategoryChannel extends BaseGuildChannel<ChannelType.GuildCategory> {
	protected setSpecificData() {}
}
