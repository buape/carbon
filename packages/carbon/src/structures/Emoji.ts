import type { APIApplicationEmoji, APIEmoji } from "discord-api-types/v10"
import { Routes } from "discord-api-types/v10"
import { Base } from "../abstracts/Base.js"
import type { Client } from "../classes/Client.js"
import { type CDNUrlOptions, buildCDNUrl } from "../utils/index.js"
import type { Role } from "./Role.js"
import { User } from "./User.js"

export abstract class BaseEmoji<T extends APIEmoji = APIEmoji> extends Base {
	protected _rawData: T

	constructor(client: Client, rawData: T) {
		super(client)
		this._rawData = rawData
	}

	/**
	 * The ID of the emoji
	 */
	get id() {
		return this._rawData.id
	}

	/**
	 * The name of the emoji
	 */
	get name() {
		return this._rawData.name
	}

	/**
	 * The roles that can use the emoji
	 */
	get roles() {
		return this._rawData.roles
	}

	/**
	 * The user that created the emoji
	 */
	get user(): User | undefined {
		if (!this._rawData.user) return undefined
		return new User(this.client, this._rawData.user)
	}

	/**
	 * Whether the emoji requires colons
	 */
	get requireColons() {
		return this._rawData.require_colons
	}

	/**
	 * Whether the emoji is managed
	 */
	get managed() {
		return this._rawData.managed
	}

	/**
	 * Whether the emoji is animated
	 */
	get animated() {
		return this._rawData.animated
	}

	/**
	 * Whether the emoji is available (may be false due to loss of Server Boosts)
	 */
	get available() {
		return this._rawData.available
	}

	/**
	 * Get the URL of the emoji with default settings (uses gif for animated, png otherwise)
	 */
	get url(): string | null {
		if (!this.id) return null
		const format = this.animated ? "gif" : "png"
		return buildCDNUrl(`https://cdn.discordapp.com/emojis`, this.id, { format })
	}

	/**
	 * Get the URL of the emoji with custom format and size options
	 * @param options Optional format and size parameters
	 * @returns The emoji URL or null if no ID is set
	 */
	getUrl(options?: CDNUrlOptions): string | null {
		if (!this.id) return null
		return buildCDNUrl(`https://cdn.discordapp.com/emojis`, this.id, options)
	}

	toString() {
		return `<${this.animated ? "a" : ""}:${this.name}:${this.id}>`
	}
}

export class ApplicationEmoji extends BaseEmoji<APIApplicationEmoji> {
	readonly applicationId: string
	constructor(
		client: Client,
		rawData: APIApplicationEmoji,
		applicationId: string
	) {
		super(client, rawData)
		this.applicationId = applicationId
	}

	get rawData(): APIApplicationEmoji {
		return this._rawData
	}

	private setData(data: typeof this._rawData) {
		if (!data) throw new Error("Cannot set data without having data... smh")
		this._rawData = data
	}

	async setName(name: string) {
		if (!this.id) throw new Error("Emoji ID is required")
		const updatedEmoji = (await this.client.rest.patch(
			Routes.applicationEmoji(this.applicationId, this.id),
			{ body: { name } }
		)) as APIApplicationEmoji
		this.setData(updatedEmoji)
	}

	async delete() {
		if (!this.id) throw new Error("Emoji ID is required")
		await this.client.rest.delete(
			Routes.applicationEmoji(this.applicationId, this.id)
		)
	}
}

export class GuildEmoji extends BaseEmoji {
	readonly guildId: string
	constructor(client: Client, rawData: APIEmoji, guildId: string) {
		super(client, rawData)
		this.guildId = guildId
	}

	get rawData(): APIEmoji {
		return this._rawData
	}

	private setData(data: typeof this._rawData) {
		if (!data) throw new Error("Cannot set data without having data... smh")
		this._rawData = data
	}

	async setName(name: string) {
		if (!this.id) throw new Error("Emoji ID is required")
		if (!this.guildId) throw new Error("Guild ID is required")
		const updatedEmoji = (await this.client.rest.patch(
			Routes.guildEmoji(this.guildId, this.id),
			{ body: { name } }
		)) as APIEmoji
		this.setData(updatedEmoji)
	}

	/**
	 * Set the roles that can use the emoji
	 * @param roles The roles to set
	 */
	async setRoles(roles: string[] | Role[]) {
		if (!this.id) throw new Error("Emoji ID is required")
		if (!this.guildId) throw new Error("Guild ID is required")
		const updatedEmoji = (await this.client.rest.patch(
			Routes.guildEmoji(this.guildId, this.id),
			{
				body: {
					roles: roles.map((role) =>
						typeof role === "string" ? role : role.id
					)
				}
			}
		)) as APIEmoji
		this.setData(updatedEmoji)
	}

	async delete() {
		if (!this.id) throw new Error("Emoji ID is required")
		if (!this.guildId) throw new Error("Guild ID is required")
		await this.client.rest.delete(Routes.guildEmoji(this.guildId, this.id))
	}
}
