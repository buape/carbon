import type { APIGuildMediaChannel, ChannelType } from "discord-api-types/v10"
import { GuildThreadOnlyChannel } from "../abstracts/GuildThreadOnlyChannel.js"

/**
 * Represents a guild media channel (a forum channel)
 */
export class GuildMediaChannel<
	IsPartial extends boolean = false
> extends GuildThreadOnlyChannel<ChannelType.GuildMedia, IsPartial> {
	declare rawData: APIGuildMediaChannel | null
}
