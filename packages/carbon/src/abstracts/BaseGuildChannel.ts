import {
	type APIGuildChannel,
	type GuildChannelType,
	type RESTGetAPIGuildInvitesResult,
	type RESTPostAPIChannelInviteJSONBody,
	type RESTPostAPIChannelInviteResult,
	Routes
} from "discord-api-types/v10"
import { Guild } from "../structures/Guild.js"
import type { GuildCategoryChannel } from "../structures/GuildCategoryChannel.js"
import type { IfPartial } from "../utils.js"
import { BaseChannel } from "./BaseChannel.js"
import type { MessagePayload } from "../types.js"
import { serializePayload } from "../utils.js"

export abstract class BaseGuildChannel<
	Type extends GuildChannelType,
	IsPartial extends boolean = false
> extends BaseChannel<Type, IsPartial> {
	// @ts-expect-error
	declare rawData: APIGuildChannel<Type> | null

	/**
	 * The name of the channel.
	 */
	get name(): IfPartial<IsPartial, string> {
		if (!this.rawData) return undefined as never
		return this.rawData.name as never
	}

	/**
	 * The ID of the guild this channel is in
	 */
	get guildId(): IfPartial<IsPartial, string> {
		if (!this.rawData) return undefined as never
		return this.rawData.guild_id as never
	}

	/**
	 * The position of the channel in the channel list.
	 */
	get position(): IfPartial<IsPartial, number> {
		if (!this.rawData) return undefined as never
		return this.rawData.position
	}

	/**
	 * The ID of the parent category for the channel.
	 */
	get parentId(): IfPartial<IsPartial, string | null> {
		if (!this.rawData) return undefined as never
		return this.rawData.parent_id ?? null
	}

	/**
	 * Whether the channel is marked as nsfw.
	 */
	get nsfw(): IfPartial<IsPartial, boolean> {
		if (!this.rawData) return undefined as never
		return this.rawData.nsfw ?? false
	}

	/**
	 * The guild this channel is in
	 */
	get guild(): IfPartial<IsPartial, Guild<true>> {
		if (!this.rawData) return undefined as never
		if (!this.guildId) throw new Error("Cannot get guild without guild ID")
		return new Guild<true>(this.client, this.guildId)
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
		this.setField("name", name)
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
			this.setField("parent_id", parent)
		} else {
			await this.client.rest.patch(Routes.channel(this.id), {
				body: {
					parent_id: parent.id
				}
			})
			this.setField("parent_id", parent.id)
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
		this.setField("nsfw", nsfw)
	}

	/**
	 * Send a message to the channel
	 */
	async send(message: MessagePayload) {
		this.client.rest.post(Routes.channelMessages(this.id), {
			body: serializePayload(message)
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
		await this.client.rest.post(Routes.channelTyping(this.id), {})
	}
}
