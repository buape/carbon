import {
	type APIRole,
	type APIRoleTags,
	type RoleFlags,
	Routes
} from "discord-api-types/v10"
import { Base } from "../abstracts/Base.js"
import type { Client } from "../classes/Client.js"
import type { IfPartial } from "../types/index.js"
import { buildCDNUrl, type CDNUrlOptions } from "../utils/index.js"

export class Role<IsPartial extends boolean = false> extends Base {
	constructor(
		client: Client,
		rawDataOrId: IsPartial extends true ? string : APIRole
	) {
		super(client)
		if (typeof rawDataOrId === "string") {
			this.id = rawDataOrId
		} else {
			this._rawData = rawDataOrId
			this.id = rawDataOrId.id
			this.setData(rawDataOrId)
		}
	}

	protected _rawData: APIRole | null = null
	private setData(data: typeof this._rawData) {
		if (!data) throw new Error("Cannot set data without having data... smh")
		this._rawData = data
	}
	private setField(key: keyof APIRole, value: unknown) {
		if (!this._rawData)
			throw new Error("Cannot set field without having data... smh")
		Reflect.set(this._rawData, key, value)
	}

	/**
	 * The raw Discord API data for this role
	 */
	get rawData(): Readonly<APIRole> {
		if (!this._rawData)
			throw new Error(
				"Cannot access rawData on partial Role. Use fetch() to populate data."
			)
		return this._rawData
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
		return (this._rawData === null) as never
	}

	/**
	 * The name of the role.
	 */
	get name(): IfPartial<IsPartial, string> {
		if (!this._rawData) return undefined as never
		return this._rawData.name
	}

	/**
	 * The color of the role.
	 */
	get color(): IfPartial<IsPartial, number> {
		if (!this._rawData) return undefined as never
		return this._rawData.color
	}

	/**
	 * The icon hash of the role.
	 * You can use {@link Role.iconUrl} to get the URL of the icon.
	 */
	get icon(): IfPartial<IsPartial, string | null> {
		if (!this._rawData) return undefined as never
		return this._rawData.icon ?? null
	}

	/**
	 * Get the URL of the role's icon with default settings (png format)
	 */
	get iconUrl(): IfPartial<IsPartial, string | null> {
		if (!this._rawData) return undefined as never
		return buildCDNUrl(`https://cdn.discordapp.com/role-icons/${this.id}`, this.icon)
	}

	/**
	 * Get the URL of the role's icon with custom format and size options
	 * @param options Optional format and size parameters
	 * @returns The icon URL or null if no icon is set
	 */
	getIconUrl(options?: CDNUrlOptions): IfPartial<IsPartial, string | null> {
		if (!this._rawData) return undefined as never
		return buildCDNUrl(`https://cdn.discordapp.com/role-icons/${this.id}`, this.icon, options)
	}

	/**
	 * If this role is mentionable.
	 */
	get mentionable(): IfPartial<IsPartial, boolean> {
		if (!this._rawData) return undefined as never
		return this._rawData.mentionable
	}

	/**
	 * If this role is hoisted.
	 */
	get hoisted(): IfPartial<IsPartial, boolean> {
		if (!this._rawData) return undefined as never
		return this._rawData.hoist
	}

	/**
	 * The position of the role.
	 */
	get position(): IfPartial<IsPartial, number> {
		if (!this._rawData) return undefined as never
		return this._rawData.position
	}

	/**
	 * The permissions of the role.
	 */
	get permissions(): IfPartial<IsPartial, bigint> {
		if (!this._rawData) return undefined as never
		return BigInt(this._rawData.permissions)
	}

	/**
	 * If this role is managed by an integration.
	 */
	get managed(): IfPartial<IsPartial, boolean> {
		if (!this._rawData) return undefined as never
		return this._rawData.managed
	}

	/**
	 * The unicode emoji for the role.
	 */
	get unicodeEmoji(): IfPartial<IsPartial, string | null> {
		if (!this._rawData) return undefined as never
		return this._rawData.unicode_emoji ?? null
	}

	/**
	 * The flags of this role.
	 * @see https://discord.com/developers/docs/topics/permissions#role-object-role-flags
	 */
	get flags(): IfPartial<IsPartial, RoleFlags> {
		if (!this._rawData) return undefined as never
		return this._rawData.flags
	}

	/**
	 * The tags of this role.
	 * @see https://discord.com/developers/docs/topics/permissions#role-object-role-tags-structure
	 */
	get tags(): IfPartial<IsPartial, APIRoleTags | undefined> {
		if (!this._rawData) return undefined as never
		return this._rawData.tags
	}

	/**
	 * Returns the Discord mention format for this role
	 * @returns The mention string in the format <@&roleId>
	 */
	toString(): string {
		return `<@&${this.id}>`
	}

	/**
	 * Fetch updated data for this role.
	 * If the role is partial, this will fetch all the data for the role and populate the fields.
	 * If the role is not partial, all fields will be updated with new values from Discord.
	 * @param guildId The ID of the guild the role is in
	 * @returns A Promise that resolves to a non-partial Role
	 */
	async fetch(guildId: string): Promise<Role<false>> {
		const newData = (await this.client.rest.get(
			Routes.guildRole(guildId, this.id)
		)) as APIRole
		if (!newData) throw new Error(`Role ${this.id} not found`)

		this.setData(newData)

		return this as Role<false>
	}

	/**
	 * Set the name of the role
	 * @param reason The reason for changing the name (will be shown in audit log)
	 */
	async setName(guildId: string, name: string, reason?: string) {
		await this.client.rest.patch(Routes.guildRole(guildId, this.id), {
			body: { name },
			headers: reason ? { "X-Audit-Log-Reason": reason } : undefined
		})
		this.setField("name", name)
	}

	/**
	 * Set the color of the role
	 * @param reason The reason for changing the color (will be shown in audit log)
	 */
	async setColor(guildId: string, color: number, reason?: string) {
		await this.client.rest.patch(Routes.guildRole(guildId, this.id), {
			body: { color },
			headers: reason ? { "X-Audit-Log-Reason": reason } : undefined
		})
		this.setField("color", color)
	}

	/**
	 * Set the icon of the role
	 * @param icon The unicode emoji or icon URL to set
	 * @param reason The reason for changing the icon (will be shown in audit log)
	 */
	async setIcon(guildId: string, icon: string, reason?: string) {
		await this.client.rest.patch(Routes.guildRole(guildId, this.id), {
			body: { icon },
			headers: reason ? { "X-Audit-Log-Reason": reason } : undefined
		})
		this.setField("icon", icon)
	}

	/**
	 * Set the mentionable status of the role
	 * @param reason The reason for changing the mentionable status (will be shown in audit log)
	 */
	async setMentionable(guildId: string, mentionable: boolean, reason?: string) {
		await this.client.rest.patch(Routes.guildRole(guildId, this.id), {
			body: { mentionable },
			headers: reason ? { "X-Audit-Log-Reason": reason } : undefined
		})
		this.setField("mentionable", mentionable)
	}

	/**
	 * Set the hoisted status of the role
	 * @param reason The reason for changing the hoisted status (will be shown in audit log)
	 */
	async setHoisted(guildId: string, hoisted: boolean, reason?: string) {
		await this.client.rest.patch(Routes.guildRole(guildId, this.id), {
			body: { hoist: hoisted },
			headers: reason ? { "X-Audit-Log-Reason": reason } : undefined
		})
		this.setField("hoist", hoisted)
	}

	/**
	 * Set the position of the role
	 * @param reason The reason for changing the position (will be shown in audit log)
	 */
	async setPosition(guildId: string, position: number, reason?: string) {
		await this.client.rest.patch(Routes.guildRole(guildId, this.id), {
			body: { position },
			headers: reason ? { "X-Audit-Log-Reason": reason } : undefined
		})
		this.setField("position", position)
	}

	/**
	 * Set the permissions of the role
	 * @param permissions The permissions to set
	 * @param reason The reason for changing the permissions (will be shown in audit log)
	 */
	async setPermissions(
		guildId: string,
		permissions: bigint[],
		reason?: string
	) {
		const permValue = permissions.reduce((acc, perm) => acc | perm, BigInt(0))
		await this.client.rest.patch(Routes.guildRole(guildId, this.id), {
			body: { permissions: permValue.toString() },
			headers: reason ? { "X-Audit-Log-Reason": reason } : undefined
		})
		this.setField("permissions", permValue.toString())
	}

	/**
	 * Delete the role
	 * @param reason The reason for deleting the role (will be shown in audit log)
	 */
	async delete(guildId: string, reason?: string) {
		await this.client.rest.delete(Routes.guildRole(guildId, this.id), {
			headers: reason ? { "X-Audit-Log-Reason": reason } : undefined
		})
	}
}
