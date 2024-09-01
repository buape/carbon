import {
	type APIMessage,
	Routes,
	type APIChannel,
	type APIGuildChannel,
	type GuildChannelType,
	type RESTGetAPIGuildInvitesResult,
	type RESTPostAPIChannelInviteJSONBody,
	type RESTPostAPIChannelInviteResult
} from "discord-api-types/v10"
import { BaseChannel } from "./BaseChannel.js"
import { Guild } from "../structures/Guild.js"
import type { GuildCategoryChannel } from "../structures/GuildCategoryChannel.js"

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

	/**
	 * Set the name of the channel
	 * @param name The new name of the channel
	 */
	async setName(name: string) {
		await this.client.rest.patch(Routes.channel(this.id), {
			body: {
				name
			}
		})
		this.name = name
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
		this.position = position
	}

	/**
	 * Set the parent ID of the channel
	 * @param parent The new category channel or ID to set
	 */
	async setParent(parent: GuildCategoryChannel | string) {
		if (typeof parent === "string") {
			await this.client.rest.patch(Routes.channel(this.id), {
				body: {
					parent_id: parent
				}
			})
			this.parentId = parent
		} else {
			await this.client.rest.patch(Routes.channel(this.id), {
				body: {
					parent_id: parent.id
				}
			})
			this.parentId = parent.id
		}
	}

	/**
	 * Set whether the channel is nsfw
	 * @param nsfw The new nsfw status of the channel
	 */
	async setNsfw(nsfw: boolean) {
		await this.client.rest.patch(Routes.channel(this.id), {
			body: {
				nsfw
			}
		})
		this.nsfw = nsfw
	}

	/**
	 * Send a message to the channel
	 */
	async send(message: APIMessage) {
		this.client.rest.post(Routes.channelMessages(this.id), {
			body: { ...message }
		})
	}

	/**
	 * Get the invites for the channel
	 */
	async getInvites() {
		return (await this.client.rest.get(
			Routes.channelInvites(this.id)
		)) as RESTGetAPIGuildInvitesResult
	}

	/**
	 * Create an invite for the channel
	 */
	async createInvite(options?: RESTPostAPIChannelInviteJSONBody) {
		return (await this.client.rest.post(Routes.channelInvites(this.id), {
			body: { ...options }
		})) as RESTPostAPIChannelInviteResult
	}

	/**
	 * Trigger a typing indicator in the channel (this will expire after 10 seconds)
	 */
	async triggerTyping() {
		await this.client.rest.post(Routes.channelTyping(this.id))
	}
}
