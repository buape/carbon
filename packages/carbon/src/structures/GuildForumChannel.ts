import type {
	APIGuildForumChannel,
	ChannelType,
	ForumLayoutType
} from "discord-api-types/v10"
import { GuildThreadOnlyChannel } from "../abstracts/GuildThreadOnlyChannel.js"
import type { BrandedDiscordIds, ChannelId, IfPartial } from "../types/index.js"

/**
 * Represents a guild forum channel.
 */
export class GuildForumChannel<
	IsPartial extends boolean = false
> extends GuildThreadOnlyChannel<ChannelType.GuildForum, IsPartial> {
	declare rawData: BrandedDiscordIds<APIGuildForumChannel, ChannelId> | null

	/**
	 * The default forum layout of the channel.
	 */
	get defaultForumLayout(): IfPartial<IsPartial, ForumLayoutType | null> {
		if (!this.rawData) return undefined as never
		return this.rawData.default_forum_layout as never
	}
}
