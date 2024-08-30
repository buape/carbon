import {
	type APIGuild,
	type APIRole,
	type RESTPostAPIGuildRoleJSONBody,
	Routes
} from "discord-api-types/v10"
import { Base } from "../abstracts/Base.js"
import type { Client } from "../classes/Client.js"
import { Role } from "./Role.js"

export class Guild extends Base {
	/**
	 * The ID of the guild
	 */
	id: string
	/**
	 * The name of the guild.
	 */
	name?: string
	/**
	 * The description of the guild.
	 */
	description?: string | null
	/**
	 * The icon hash of the guild.
	 * You can use {@link Guild.iconUrl} to get the URL of the icon.
	 */
	icon?: string | null
	/**
	 * The splash hash of the guild.
	 * You can use {@link Guild.splashUrl} to get the URL of the splash.
	 */
	splash?: string | null
	/**
	 * The ID of the owner of the guild.
	 */
	ownerId?: string

	/**
	 * Whether the guild is a partial guild (meaning it does not have all the data).
	 * If this is true, you should use {@link Guild.fetch} to get the full data of the guild.
	 */
	partial: boolean

	private rawData: APIGuild | null = null

	constructor(client: Client, rawDataOrId: APIGuild | string) {
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
		this.description = data.description
		this.icon = data.icon
		this.splash = data.splash
		this.ownerId = data.owner_id
		this.partial = false
	}

	/**
	 * Fetch updated data for this guild.
	 * If the guild is partial, this will fetch all the data for the guild and populate the fields.
	 * If the guild is not partial, all fields will be updated with new values from Discord.
	 */
	async fetch() {
		const newData = (await this.client.rest.get(
			Routes.guild(this.id)
		)) as APIGuild
		if (!newData) throw new Error(`Guild ${this.id}not found`)

		this.setData(newData)
	}

	/**
	 * Leave the guild
	 */
	async leave() {
		return await this.client.rest.delete(Routes.guild(this.id))
	}

	/**
	 * Create a role in the guild
	 */
	async createRole(data: RESTPostAPIGuildRoleJSONBody) {
		const role = (await this.client.rest.post(Routes.guildRoles(this.id), {
			body: {
				...data
			}
		})) as APIRole
		return new Role(this.client, role)
	}

	/**
	 * Get the URL of the guild's icon
	 */
	get iconUrl(): string | null {
		return this.icon
			? `https://cdn.discordapp.com/icons/${this.id}/${this.icon}.png`
			: null
	}

	/**
	 * Get the URL of the guild's splash
	 */
	get splashUrl(): string | null {
		return this.splash
			? `https://cdn.discordapp.com/splashes/${this.id}/${this.splash}.png`
			: null
	}

	/**
	 * Get all roles in the guild
	 */
	get roles() {
		const roles = this.rawData?.roles
		if (!roles) throw new Error("Cannot get roles without having data... smh")
		return roles.map((role) => new Role(this.client, role))
	}
}
