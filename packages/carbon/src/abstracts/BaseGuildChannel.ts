import type {
	APIChannel,
	APIGuildChannel,
	GuildChannelType
} from "discord-api-types/v10"
import { BaseChannel } from "./BaseChannel.js"
import { Guild } from "../structures/Guild.js"

export abstract class BaseGuildChannel<
	Type extends GuildChannelType
> extends BaseChannel<Type> {
	/**
	 * The name of the channel.
	 */
	name?: string
	/**
	 * The ID of the guild this channel is in
	 */
	guildId?: string
	/**
	 * The position of the channel in the channel list.
	 */
	position?: number
	/**
	 * The ID of the parent category for the channel.
	 */
	parentId?: string | null
	/**
	 * Whether the channel is marked as nsfw.
	 */
	nsfw?: boolean

	/**
	 * The guild this channel is in
	 */
	get guild() {
		if (!this.guildId) throw new Error("Cannot get guild without guild ID")
		return new Guild(this.client, this.guildId)
	}

	protected override setData(data: APIGuildChannel<Type>): void {
		this.rawData = data as Extract<APIChannel, { type: Type }> | null
		this.partial = false
		this.name = data.name
		this.guildId = data.guild_id
		this.position = data.position
		this.parentId = data.parent_id
		this.nsfw = data.nsfw
		this.setSpecificData(data as Extract<APIChannel, { type: Type }>)
	}
}
