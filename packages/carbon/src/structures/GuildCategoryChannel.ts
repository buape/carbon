import type {
	APIGuildCategoryChannel,
	ChannelType
} from "discord-api-types/v10"
import { BaseGuildChannel } from "../abstracts/BaseGuildChannel.js"

/**
 * Represents a guild category channel.
 */
export class GuildCategoryChannel<
	IsPartial extends boolean = false
> extends BaseGuildChannel<ChannelType.GuildCategory, IsPartial> {
	declare rawData: APIGuildCategoryChannel | null

	/**
	 * You cannot send a message to a category channel, so this method throws an error
	 */
	override async send(): Promise<never> {
		throw new Error("Category channels cannot be sent to")
	}
}
