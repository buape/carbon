import {
	type APIChannel,
	type APIGuild,
	type APIGuildMember,
	type APIRole,
	type RESTPostAPIGuildRoleJSONBody,
	Routes
} from "discord-api-types/v10"
import { Base } from "../abstracts/Base.js"
import type { Client } from "../classes/Client.js"
import { channelFactory } from "../factories/channelFactory.js"
import type { IfPartial } from "../utils.js"
import { GuildMember } from "./GuildMember.js"
import { Role } from "./Role.js"

export class Guild<IsPartial extends boolean = false> extends Base {
	constructor(
		client: Client,
		rawDataOrId: IsPartial extends true ? string : APIGuild
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

	private rawData: APIGuild | null = null
	private setData(data: typeof this.rawData) {
		if (!data) throw new Error("Cannot set data without having data... smh")
		this.rawData = data
	}
	// private setField(key: keyof APIGuild, value: unknown) {
	// 	if (!this.rawData)
	// 		throw new Error("Cannot set field without having data... smh")
	// 	Reflect.set(this.rawData, key, value)
	// }

	/**
	 * The ID of the guild
	 */
	readonly id: string

	/**
	 * Whether the guild is a partial guild (meaning it does not have all the data).
	 * If this is true, you should use {@link Guild.fetch} to get the full data of the guild.
	 */
	get partial(): IfPartial<IsPartial, false, true> {
		return (this.rawData === null) as never
	}

	/**
	 * The name of the guild.
	 */
	get name(): IfPartial<IsPartial, string> {
		if (!this.rawData) return undefined as never
		return this.rawData.name as never
	}

	/**
	 * The description of the guild.
	 */
	get description(): IfPartial<IsPartial, string | null> {
		if (!this.rawData) return undefined as never
		return this.rawData.description as never
	}

	/**
	 * The icon hash of the guild.
	 * You can use {@link Guild.iconUrl} to get the URL of the icon.
	 */
	get icon(): IfPartial<IsPartial, string | null> {
		if (!this.rawData) return undefined as never
		return this.rawData.icon as never
	}

	/**
	 * The splash hash of the guild.
	 * You can use {@link Guild.splashUrl} to get the URL of the splash.
	 */
	get splash(): IfPartial<IsPartial, string | null> {
		if (!this.rawData) return undefined as never
		return this.rawData.splash as never
	}

	/**
	 * The ID of the owner of the guild.
	 */
	get ownerId(): IfPartial<IsPartial, string> {
		if (!this.rawData) return undefined as never
		return this.rawData.owner_id as never
	}

	/**
	 * Get all roles in the guild
	 */
	get roles() {
		const roles = this.rawData?.roles
		if (!roles) throw new Error("Cannot get roles without having data... smh")
		return roles.map((role) => new Role(this.client, role))
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
	 * Get a member in the guild by ID
	 */
	async fetchMember(memberId: string) {
		const member = (await this.client.rest.get(
			Routes.guildMember(this.id, memberId)
		)) as APIGuildMember
		return new GuildMember(this.client, member, this)
	}

	/**
	 * Fetch a channel from the guild by ID
	 */
	async fetchChannel(channelId: string) {
		const channel = (await this.client.rest.get(
			Routes.channel(channelId)
		)) as APIChannel
		return channelFactory(this.client, channel)
	}
}
