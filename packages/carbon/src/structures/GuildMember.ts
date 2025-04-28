import type { APIGuildMember, GuildMemberFlags } from "discord-api-types/v10"
import { Base } from "../abstracts/Base.js"
import type { Client } from "../classes/Client.js"
import type { IfPartial } from "../utils.js"
import type { Guild } from "./Guild.js"
import { Role } from "./Role.js"
import { User } from "./User.js"
import { maxPermissions } from "../permissions.js"

export class GuildMember<
	// This currently can never be partial, so we don't need to worry about it
	IsPartial extends false = false,
	IsGuildPartial extends boolean = false
> extends Base {
	constructor(
		client: Client,
		rawData: APIGuildMember,
		guild: Guild<IsGuildPartial>
	) {
		super(client)
		this.rawData = rawData
		this.guild = guild
		this.user = new User(client, rawData.user)
		this.setData(rawData)
	}

	private rawData: APIGuildMember | null = null
	private setData(data: typeof this.rawData) {
		if (!data) throw new Error("Cannot set data without having data... smh")
		this.rawData = data
	}
	private setField(key: keyof APIGuildMember, value: unknown) {
		if (!this.rawData)
			throw new Error("Cannot set field without having data... smh")
		Reflect.set(this.rawData, key, value)
	}

	/**
	 * The guild object of the member.
	 */
	guild: Guild<IsGuildPartial>

	/**
	 * The user object of the member.
	 */
	user: User

	/**
	 * The guild-specific nickname of the member.
	 */
	get nickname(): IfPartial<IsPartial, string | null> {
		if (!this.rawData) return undefined as never
		return this.rawData.nick ?? null
	}

	/**
	 * The guild-specific avatar hash of the member.
	 * You can use {@link GuildMember.avatarUrl} to get the URL of the avatar.
	 */
	get avatar(): IfPartial<IsPartial, string | null> {
		if (!this.rawData) return undefined as never
		return this.rawData.avatar ?? null
	}

	/**
	 * Get the URL of the member's guild-specific avatar
	 */
	get avatarUrl(): IfPartial<IsPartial, string | null> {
		if (!this.rawData) return undefined as never
		if (!this.user || !this.avatar) return null
		return `https://cdn.discordapp.com/guilds/${this.guild.id}/users/${this.user.id}/${this.avatar}.png`
	}

	/**
	 * Is this member muted in Voice Channels?
	 */
	get mute(): IfPartial<IsPartial, boolean> {
		if (!this.rawData) return undefined as never
		return this.rawData.mute
	}

	/**
	 * Is this member deafened in Voice Channels?
	 */
	get deaf(): IfPartial<IsPartial, boolean> {
		if (!this.rawData) return undefined as never
		return this.rawData.deaf
	}

	/**
	 * The date since this member boosted the guild, if applicable.
	 */
	get premiumSince(): IfPartial<IsPartial, string | null> {
		if (!this.rawData) return undefined as never
		return this.rawData.premium_since ?? null
	}

	/**
	 * The flags of the member.
	 * @see https://discord.com/developers/docs/resources/guild#guild-member-object-guild-member-flags
	 */
	get flags(): IfPartial<IsPartial, GuildMemberFlags> {
		if (!this.rawData) return undefined as never
		return this.rawData.flags
	}

	/**
	 * The roles of the member
	 */
	get roles(): IfPartial<IsPartial, Role<true>[]> {
		if (!this.rawData) return undefined as never
		const roles = this.rawData.roles ?? []
		return roles.map((role) => new Role<true>(this.client, role))
	}

	/**
	 * The joined date of the member
	 */
	get joinedAt(): IfPartial<IsPartial, string> {
		if (!this.rawData) return undefined as never
		return this.rawData.joined_at
	}

	/**
	 * The date when the member's communication privileges (timeout) will be reinstated
	 */
	get communicationDisabledUntil(): IfPartial<IsPartial, string | null> {
		if (!this.rawData) return undefined as never
		return this.rawData.communication_disabled_until ?? null
	}

	/**
	 * Is this member yet to pass the guild's Membership Screening requirements?
	 */
	get pending(): IfPartial<IsPartial, boolean> {
		if (!this.rawData) return undefined as never
		return this.rawData.pending ?? false
	}

	async getPermissions(): Promise<IfPartial<IsPartial, bigint[]>> {
		if (!this.rawData) return undefined as never
		if (this.guild.ownerId === this.user.id) return maxPermissions
		const permissions = await Promise.all(
			this.roles.map(async (x) => {
				if (x.partial) await x.fetch(this.guild.id)
				if (!x.permissions) return undefined
				return BigInt(x.permissions)
			})
		)
		return permissions.filter((x) => x !== undefined)
	}

	/**
	 * Set the nickname of the member
	 */
	async setNickname(nickname: string | null): Promise<void> {
		await this.client.rest.patch(
			`/guilds/${this.guild?.id}/members/${this.user?.id}`,
			{
				body: {
					nick: nickname
				}
			}
		)
		this.setField("nick", nickname)
	}

	/**
	 * Add a role to the member
	 */
	async addRole(roleId: string): Promise<void> {
		await this.client.rest.put(
			`/guilds/${this.guild?.id}/members/${this.user?.id}/roles/${roleId}`,
			{}
		)
		this.roles?.push(new Role<true>(this.client, roleId))
	}

	/**
	 * Remove a role from the member
	 */
	async removeRole(roleId: string): Promise<void> {
		await this.client.rest.delete(
			`/guilds/${this.guild?.id}/members/${this.user?.id}/roles/${roleId}`
		)
		const roles = this.roles?.filter((role) => role.id !== roleId)
		if (roles) this.setField("roles", roles)
	}

	/**
	 * Kick the member from the guild
	 */
	async kick(): Promise<void> {
		await this.client.rest.delete(
			`/guilds/${this.guild?.id}/members/${this.user?.id}`
		)
	}

	/**
	 * Ban the member from the guild
	 */
	async ban(
		options: { reason?: string; deleteMessageDays?: number } = {}
	): Promise<void> {
		await this.client.rest.put(
			`/guilds/${this.guild?.id}/bans/${this.user?.id}`,
			{
				body: {
					reason: options.reason,
					delete_message_days: options.deleteMessageDays
				}
			}
		)
	}

	/**
	 * Mute a member in voice channels
	 */
	async muteMember(): Promise<void> {
		await this.client.rest.patch(
			`/guilds/${this.guild?.id}/members/${this.user?.id}`,
			{
				body: {
					mute: true
				}
			}
		)
		this.setField("mute", true)
	}

	/**
	 * Unmute a member in voice channels
	 */
	async unmuteMember(): Promise<void> {
		await this.client.rest.patch(
			`/guilds/${this.guild?.id}/members/${this.user?.id}`,
			{
				body: {
					mute: false
				}
			}
		)
		this.setField("mute", false)
	}

	/**
	 * Deafen a member in voice channels
	 */
	async deafenMember(): Promise<void> {
		await this.client.rest.patch(
			`/guilds/${this.guild?.id}/members/${this.user?.id}`,
			{
				body: {
					deaf: true
				}
			}
		)
		this.setField("deaf", true)
	}

	/**
	 * Undeafen a member in voice channels
	 */
	async undeafenMember(): Promise<void> {
		await this.client.rest.patch(
			`/guilds/${this.guild?.id}/members/${this.user?.id}`,
			{
				body: {
					deaf: false
				}
			}
		)
		this.setField("deaf", false)
	}

	/**
	 * Set or remove a timeout for a member in the guild
	 */
	async timeoutMember(communicationDisabledUntil: string): Promise<void> {
		await this.client.rest.patch(
			`/guilds/${this.guild?.id}/members/${this.user?.id}`,
			{
				body: {
					communication_disabled_until: communicationDisabledUntil
				}
			}
		)
		this.setField("communication_disabled_until", communicationDisabledUntil)
	}
}
