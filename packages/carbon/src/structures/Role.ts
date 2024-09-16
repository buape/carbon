import {
	type APIRole,
	type APIRoleTags,
	type RoleFlags,
	Routes
} from "discord-api-types/v10"
import { Base } from "../abstracts/Base.js"
import type { Client } from "../classes/Client.js"
import type { IfPartial } from "../utils.js"

export class Role<IsPartial extends boolean = false> extends Base {
	constructor(
		client: Client,
		rawDataOrId: IsPartial extends true ? string : APIRole
	) {
		super(client)
		if (typeof rawDataOrId === "string") {
			this.id = rawDataOrId
		} else {
			this.rawData = rawDataOrId
			this.id = rawDataOrId.id
			this.setData(rawDataOrId)
		}
	}

	private rawData: APIRole | null = null
	private setData(data: typeof this.rawData) {
		if (!data) throw new Error("Cannot set data without having data... smh")
		this.rawData = data
	}
	private setField(key: keyof APIRole, value: unknown) {
		if (!this.rawData)
			throw new Error("Cannot set field without having data... smh")
		Reflect.set(this.rawData, key, value)
	}

	/**
	 * The ID of the role.
	 */
	readonly id: string

	/**
	 * Whether the role is a partial role (meaning it does not have all the data).
	 * If this is true, you should use {@link Role.fetch} to get the full data of the role.
	 */
	get partial(): IsPartial {
		return (this.rawData === null) as never
	}

	/**
	 * The name of the role.
	 */
	get name(): IfPartial<IsPartial, string> {
		if (!this.rawData) return undefined as never
		return this.rawData.name as never
	}

	/**
	 * The color of the role.
	 */
	get color(): IfPartial<IsPartial, number> {
		if (!this.rawData) return undefined as never
		return this.rawData.color as never
	}

	/**
	 * The icon hash of the role.
	 * You can use {@link Role.iconUrl} to get the URL of the icon.
	 */
	get icon(): IfPartial<IsPartial, string> {
		if (!this.rawData) return undefined as never
		return this.rawData.icon as never
	}

	/**
	 * If this role is mentionable.
	 */
	get mentionable(): IfPartial<IsPartial, boolean> {
		if (!this.rawData) return undefined as never
		return this.rawData.mentionable as never
	}

	/**
	 * If this role is hoisted.
	 */
	get hoisted(): IfPartial<IsPartial, boolean> {
		if (!this.rawData) return undefined as never
		return this.rawData.hoist as never
	}

	/**
	 * The position of the role.
	 */
	get position(): IfPartial<IsPartial, number> {
		if (!this.rawData) return undefined as never
		return this.rawData.position as never
	}

	/**
	 * The permissions of the role.
	 */
	get permissions(): IfPartial<IsPartial, string> {
		if (!this.rawData) return undefined as never
		return this.rawData.permissions as never
	}

	/**
	 * If this role is managed by an integration.
	 */
	get managed(): IfPartial<IsPartial, boolean> {
		if (!this.rawData) return undefined as never
		return this.rawData.managed as never
	}

	/**
	 * The unicode emoji for the role.
	 */
	get unicodeEmoji(): IfPartial<IsPartial, string> {
		if (!this.rawData) return undefined as never
		return this.rawData.unicode_emoji as never
	}

	/**
	 * The flags of this role.
	 * @see https://discord.com/developers/docs/topics/permissions#role-object-role-flags
	 */
	get flags(): IfPartial<IsPartial, RoleFlags> {
		if (!this.rawData) return undefined as never
		return this.rawData.flags as never
	}

	/**
	 * The tags of this role.
	 * @see https://discord.com/developers/docs/topics/permissions#role-object-role-tags-structure
	 */
	get tags(): IfPartial<IsPartial, APIRoleTags> {
		if (!this.rawData) return undefined as never
		return this.rawData.tags as never
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
		await this.client.rest.patch(Routes.guildRole(guildId, this.id), {
			body: {
				name
			}
		})
		this.setField("name", name)
	}

	/**
	 * Set the color of the role
	 */
	async setColor(guildId: string, color: number) {
		await this.client.rest.patch(Routes.guildRole(guildId, this.id), {
			body: { color }
		})
		this.setField("color", color)
	}

	/**
	 * Set the icon of the role
	 * @param icon The unicode emoji or icon URL to set
	 */
	async setIcon(guildId: string, icon: string) {
		await this.client.rest.patch(Routes.guildRole(guildId, this.id), {
			body: { icon }
		})
		this.setField("icon", icon)
	}

	/**
	 * Set the mentionable status of the role
	 */
	async setMentionable(guildId: string, mentionable: boolean) {
		await this.client.rest.patch(Routes.guildRole(guildId, this.id), {
			body: { mentionable }
		})
		this.setField("mentionable", mentionable)
	}

	/**
	 * Set the hoisted status of the role
	 */
	async setHoisted(guildId: string, hoisted: boolean) {
		await this.client.rest.patch(Routes.guildRole(guildId, this.id), {
			body: { hoist: hoisted }
		})
		this.setField("hoist", hoisted)
	}

	/**
	 * Set the position of the role
	 */
	async setPosition(guildId: string, position: number) {
		await this.client.rest.patch(Routes.guildRole(guildId, this.id), {
			body: { position }
		})
		this.setField("position", position)
	}

	/**
	 * Set the permissions of the role
	 * @param permissions The permissions to set as a BitField string, until a better permission structure is implemented
	 */
	async setPermissions(guildId: string, permissions: string) {
		await this.client.rest.patch(Routes.guildRole(guildId, this.id), {
			body: { permissions }
		})
		this.setField("permissions", permissions)
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
