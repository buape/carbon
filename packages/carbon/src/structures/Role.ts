import {
	type APIRole,
	type APIRoleTags,
	type RoleFlags,
	Routes
} from "discord-api-types/v10"
import { Base } from "../abstracts/Base.js"
import type { Client } from "../classes/Client.js"

export class Role extends Base {
	/**
	 * The ID of the role.
	 */
	id: string
	/**
	 * The name of the role.
	 */
	name?: string | null
	/**
	 * The color of the role.
	 */
	color?: number | null
	/**
	 * The icon hash of the role.
	 * You can use {@link Role.iconUrl} to get the URL of the icon.
	 */
	icon?: string | null
	/**
	 * If this role is mentionable.
	 */
	mentionable?: boolean | null
	/**
	 * If this role is hoisted.
	 */
	hoisted?: boolean | null
	/**
	 * The position of the role.
	 */
	position?: number | null
	/**
	 * The permissions of the role.
	 */
	permissions?: string | null
	/**
	 * If this role is managed by an integration.
	 */
	managed?: boolean | null
	/**
	 * The unicode emoji for the role.
	 */
	unicodeEmoji?: string | null
	/**
	 * The flags of this role.
	 * @see https://discord.com/developers/docs/topics/permissions#role-object-role-flags
	 */
	flags?: RoleFlags | null
	/**
	 * The tags of this role.
	 * @see https://discord.com/developers/docs/topics/permissions#role-object-role-tags-structure
	 */
	tags?: APIRoleTags | null

	/**
	 * Whether the role is a partial role (meaning it does not have all the data).
	 * If this is true, you should use {@link Role.fetch} to get the full data of the role.
	 */
	partial: boolean

	private rawData: APIRole | null = null

	constructor(client: Client, rawDataOrId: APIRole | string) {
		super(client)
		if (typeof rawDataOrId === "string") {
			this.id = rawDataOrId
			this.partial = true
		} else {
			this.rawData = rawDataOrId
			this.id = rawDataOrId.id
			this.partial = false
			this.setData(rawDataOrId)
		}
	}

	private setData(data: typeof this.rawData) {
		if (!data) throw new Error("Cannot set data without having data... smh")
		this.rawData = data
		this.name = data.name
		this.color = data.color
		this.icon = data.icon
		this.mentionable = data.mentionable
		this.hoisted = data.hoist
		this.position = data.position
		this.permissions = data.permissions
		this.managed = data.managed
		this.unicodeEmoji = data.unicode_emoji
		this.flags = data.flags
		this.tags = data.tags
		this.partial = false
	}

	/**
	 * Fetch updated data for this role.
	 * If the role is partial, this will fetch all the data for the role and populate the fields.
	 * If the role is not partial, all fields will be updated with new values from Discord.
	 */
	async fetch(guildId: string) {
		const newData = (await this.client.rest.get(
			Routes.guildRole(guildId, this.id)
		)) as APIRole
		if (!newData) throw new Error(`Role ${this.id} not found`)

		this.setData(newData)
	}

	/**
	 * Set the name of the role
	 */
	async setName(guildId: string, name: string) {
		await this.client.rest.patch(Routes.guildRole(guildId, this.id), { name })
		this.name = name
	}

	/**
	 * Set the color of the role
	 */
	async setColor(guildId: string, color: number) {
		await this.client.rest.patch(Routes.guildRole(guildId, this.id), { color })
		this.color = color
	}

	/**
	 * Set the icon of the role
	 * @param icon The unicode emoji or icon URL to set
	 */
	async setIcon(guildId: string, icon: string) {
		await this.client.rest.patch(Routes.guildRole(guildId, this.id), { icon })
		this.icon = icon
	}

	/**
	 * Set the mentionable status of the role
	 */
	async setMentionable(guildId: string, mentionable: boolean) {
		await this.client.rest.patch(Routes.guildRole(guildId, this.id), {
			mentionable
		})
		this.mentionable = mentionable
	}

	/**
	 * Set the hoisted status of the role
	 */
	async setHoisted(guildId: string, hoisted: boolean) {
		await this.client.rest.patch(Routes.guildRole(guildId, this.id), {
			hoist: hoisted
		})
		this.hoisted = hoisted
	}

	/**
	 * Set the position of the role
	 */
	async setPosition(guildId: string, position: number) {
		await this.client.rest.patch(Routes.guildRole(guildId, this.id), {
			position
		})
		this.position = position
	}

	/**
	 * Set the permissions of the role
	 * @param permissions The permissions to set as a BitField string, until a better permission structure is implemented
	 */
	async setPermissions(guildId: string, permissions: string) {
		await this.client.rest.patch(Routes.guildRole(guildId, this.id), {
			permissions
		})
		this.permissions = permissions
	}

	async delete(guildId: string) {
		await this.client.rest.delete(Routes.guildRole(guildId, this.id))
	}

	/**
	 * Get the URL of the role's icon
	 */
	get iconUrl(): string | null {
		return this.icon
			? `https://cdn.discordapp.com/role-icons/${this.id}/${this.icon}.png`
			: null
	}
}
