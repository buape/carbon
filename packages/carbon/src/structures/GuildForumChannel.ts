import type {
	APIGuildForumChannel,
	ChannelType,
	ForumLayoutType
} from "discord-api-types/v10"
import { GuildThreadOnlyChannel } from "../abstracts/GuildThreadOnlyChannel.js"

/**
 * Represents a guild forum channel.
 */
export class GuildForumChannel extends GuildThreadOnlyChannel<ChannelType.GuildForum> {
	/**
	 * The default forum layout of the channel.
	 */
	defaultForumLayout?: ForumLayoutType

	protected setMoreSpecificData(data: APIGuildForumChannel) {
		this.defaultForumLayout = data.default_forum_layout
	}
}
