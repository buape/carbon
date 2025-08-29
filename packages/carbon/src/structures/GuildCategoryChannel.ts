import {
	type APIGuildCategoryChannel,
	type ChannelType,
	Routes
} from "discord-api-types/v10"
import { BaseGuildChannel } from "../abstracts/BaseGuildChannel.js"
import type { IfPartial } from "../types/index.js"

/**
 * Represents a guild category channel.
 */
export class GuildCategoryChannel<
	IsPartial extends boolean = false
> extends BaseGuildChannel<ChannelType.GuildCategory, IsPartial> {
	declare rawData: APIGuildCategoryChannel | null

	/**
	 * The position of the channel in the channel list.
	 */
	get position(): IfPartial<IsPartial, number> {
		if (!this.rawData) return undefined as never
		return this.rawData.position
	}

	/**
	 * Set the position of the channel
	 * @param position The new position of the channel
	 */
	async setPosition(position: number) {
		await this.client.rest.patch(Routes.channel(this.id), {
			body: {
				position
			}
		})
		this.setField("position", position)
	}

	/**
	 * You cannot send a message to a category channel, so this method throws an error
	 */
	override async send(): Promise<never> {
		throw new Error("Category channels cannot be sent to")
	}
}
