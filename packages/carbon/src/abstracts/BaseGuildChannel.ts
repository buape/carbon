import {
	type APIGuildChannel,
	type APIMessage,
	type APIOverwrite,
	ChannelType,
	type GuildChannelType,
	OverwriteType,
	type RESTGetAPIGuildInvitesResult,
	type RESTPostAPIChannelInviteJSONBody,
	type RESTPostAPIChannelInviteResult,
	Routes
} from "discord-api-types/v10"
import {
	allPermissions,
	Permission,
	PermissionsBitField
} from "../permissions.js"
import { Guild } from "../structures/Guild.js"
import type { GuildCategoryChannel } from "../structures/GuildCategoryChannel.js"
import { GuildMember } from "../structures/GuildMember.js"
import { Message } from "../structures/Message.js"
import { Role } from "../structures/Role.js"
import { User } from "../structures/User.js"
import type { IfPartial, MessagePayload } from "../types/index.js"
import { serializePayload } from "../utils/index.js"
import { BaseChannel } from "./BaseChannel.js"

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
	 * The explicit permission overwrites for members and roles in this channel.
	 */
	get permissionOverwrites(): IfPartial<IsPartial, APIOverwrite[]> {
		if (!this._rawData) return undefined as never
		return (this._rawData as APIGuildChannel<Type>).permission_overwrites ?? []
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
	 * Resolve the effective permissions for a member, user, or role in this channel.
	 */
	async permissionsFor(
		target: GuildMember | Role<boolean> | User<boolean> | string
	): Promise<PermissionsBitField> {
		if (!this._rawData) await this.fetch()
		const rawData = this._rawData as APIGuildChannel<Type> | null
		if (!rawData?.guild_id) {
			throw new Error("Cannot resolve channel permissions without a guild ID")
		}

		if (
			(rawData.type === ChannelType.AnnouncementThread ||
				rawData.type === ChannelType.PublicThread ||
				rawData.type === ChannelType.PrivateThread) &&
			rawData.parent_id
		) {
			const parent = await this.client.fetchChannel(rawData.parent_id)
			if (!parent.isGuildBased()) {
				throw new Error(
					"Cannot resolve thread permissions without a guild parent"
				)
			}
			const parentPermissions = await parent.permissionsFor(target)
			return new PermissionsBitField(
				parentPermissions.value & ~Permission.SendMessages
			)
		}

		const guild = await this.client.fetchGuild(rawData.guild_id)
		const member =
			target instanceof GuildMember
				? target
				: target instanceof Role
					? null
					: await guild.fetchMember(target instanceof User ? target.id : target)
		if (target instanceof Role && target.partial) await target.fetch()
		if (member === null && !(target instanceof Role)) {
			throw new Error(
				"Cannot resolve channel permissions for an unknown member"
			)
		}
		if (member && guild.ownerId === member.user.id) {
			return new PermissionsBitField(allPermissions)
		}

		const roleIds = member
			? member.roles.map((role) => role.id)
			: target instanceof Role
				? [target.id]
				: []
		const everyone = guild.roles.find((role) => role.id === guild.id)
		let permissions = everyone?.permissions ?? 0n

		for (const role of guild.roles) {
			if (role.id !== guild.id && roleIds.includes(role.id)) {
				permissions |= role.permissions
			}
		}

		if ((permissions & Permission.Administrator) === Permission.Administrator) {
			return new PermissionsBitField(allPermissions)
		}

		const overwrites = this.permissionOverwrites as APIOverwrite[]
		const everyoneOverwrite = overwrites.find(
			(overwrite) =>
				overwrite.type === OverwriteType.Role && overwrite.id === guild.id
		)
		if (everyoneOverwrite) {
			permissions &= ~BigInt(everyoneOverwrite.deny)
			permissions |= BigInt(everyoneOverwrite.allow)
		}

		let roleDeny = 0n
		let roleAllow = 0n
		for (const overwrite of overwrites) {
			if (
				overwrite.type === OverwriteType.Role &&
				overwrite.id !== guild.id &&
				roleIds.includes(overwrite.id)
			) {
				roleDeny |= BigInt(overwrite.deny)
				roleAllow |= BigInt(overwrite.allow)
			}
		}
		permissions &= ~roleDeny
		permissions |= roleAllow

		if (member) {
			const memberOverwrite = overwrites.find(
				(overwrite) =>
					overwrite.type === OverwriteType.Member &&
					overwrite.id === member.user.id
			)
			if (memberOverwrite) {
				permissions &= ~BigInt(memberOverwrite.deny)
				permissions |= BigInt(memberOverwrite.allow)
			}
			if (
				member.communicationDisabledUntil &&
				Date.parse(member.communicationDisabledUntil) > Date.now()
			) {
				permissions &= Permission.ViewChannel | Permission.ReadMessageHistory
			}
		}

		return new PermissionsBitField(permissions)
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
		const data = (await this.client.rest.post(Routes.channelMessages(this.id), {
			body: serializePayload(message)
		})) as APIMessage
		return new Message(this.client, data)
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
