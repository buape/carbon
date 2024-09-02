import type { APIGuildMember, GuildMemberFlags } from "discord-api-types/v10"
import { Base } from "../abstracts/Base.js"
import type { Client } from "../classes/Client.js"
import type { Guild } from "./Guild.js"
import { Role } from "./Role.js"
import { User } from "./User.js"

export class GuildMember extends Base {
	/**
	 * The guild-specific nickname of the member.
	 */
	nickname?: string | null
	/**
	 * The guild-specific avatar hash of the member.
	 * You can use {@link GuildMember.avatarUrl} to get the URL of the avatar.
	 */
	avatar?: string | null
	/**
	 * Is this member muted in Voice Channels?
	 */
	mute?: boolean | null
	/**
	 * Is this member deafened in Voice Channels?
	 */
	deaf?: boolean | null
	/**
	 * The date since this member boosted the guild, if applicable.
	 */
	premiumSince?: string | null
	/**
	 * The flags of the member.
	 * @see https://discord.com/developers/docs/resources/guild#guild-member-object-guild-member-flags
	 */
	flags?: GuildMemberFlags | null
	/**
	 * The roles of the member
	 */
	roles?: Role[] | null
	/**
	 * The joined date of the member
	 */
	joinedAt?: string | null
	/**
	 * The date when the member's communication privileges (timeout) will be reinstated
	 */
	communicationDisabledUntil?: string | null
	/**
	 * Is this member yet to pass the guild's Membership Screening requirements?
	 */
	pending?: boolean | null
	/**
	 * The guild object of the member
	 */
	guild: Guild
	/**
	 * The user object of the member
	 */
	user?: User | null

	private rawData: APIGuildMember | null = null

	constructor(client: Client, rawData: APIGuildMember, guild: Guild) {
		super(client)
		this.rawData = rawData
		this.guild = guild
		this.setData(rawData)
	}

	private setData(data: typeof this.rawData) {
		if (!data) throw new Error("Cannot set data without having data... smh")
		this.rawData = data
		this.nickname = data.nick
		this.avatar = data.avatar
		this.mute = data.mute
		this.deaf = data.deaf
		this.premiumSince = data.premium_since
		this.flags = data.flags
		this.roles = data.roles?.map((roleId) => new Role(this.client, roleId))
		this.joinedAt = data.joined_at
		this.communicationDisabledUntil = data.communication_disabled_until
		this.pending = data.pending
		this.user = data.user ? new User(this.client, data.user) : null
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
		this.nickname = nickname
	}

	/**
	 * Add a role to the member
	 */
	async addRole(roleId: string): Promise<void> {
		await this.client.rest.put(
			`/guilds/${this.guild?.id}/members/${this.user?.id}/roles/${roleId}`,
			{}
		)
		this.roles?.push(new Role(this.client, roleId))
	}

	/**
	 * Remove a role from the member
	 */
	async removeRole(roleId: string): Promise<void> {
		await this.client.rest.delete(
			`/guilds/${this.guild?.id}/members/${this.user?.id}/roles/${roleId}`
		)
		this.roles = this.roles?.filter((role) => role.id !== roleId)
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
		this.mute = true
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
		this.mute = false
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
		this.deaf = true
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
		this.deaf = false
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
		this.communicationDisabledUntil = communicationDisabledUntil
	}

	/**
	 * Get the URL of the member's guild-specific avatar
	 */
	get avatarUrl(): string | null {
		if (!this.user) return null
		return this.avatar
			? `https://cdn.discordapp.com/guilds/${this.guild.id}/users/${this.user?.id}/${this.avatar}.png`
			: null
	}
}
