import type {
	APIGuildForumChannel,
	ChannelType,
	ForumLayoutType
} from "discord-api-types/v10"
import { GuildThreadOnlyChannel } from "../abstracts/GuildThreadOnlyChannel.js"
import type { IfPartial } from "../utils.js"

/**
 * Represents a guild forum channel.
 */
export class GuildForumChannel<
	IsPartial extends boolean = false
> extends GuildThreadOnlyChannel<ChannelType.GuildForum, IsPartial> {
	declare rawData: APIGuildForumChannel | null

	/**
	 * The default forum layout of the channel.
	 */
	get defaultForumLayout(): IfPartial<IsPartial, ForumLayoutType | null> {
		if (!this.rawData) return undefined as never
		return this.rawData.default_forum_layout as never
	}
}
