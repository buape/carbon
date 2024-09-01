import type { ChannelType, ForumLayoutType } from "discord-api-types/v10"
import { GuildThreadOnlyChannel } from "../abstracts/GuildThreadOnlyChannel.js"

/**
 * Represents a guild media channel (a forum channel )
 */
export class GuildMediaChannel extends GuildThreadOnlyChannel<ChannelType.GuildMedia> {
	defaultForumLayout?: ForumLayoutType
	protected setMoreSpecificData() {}
}
