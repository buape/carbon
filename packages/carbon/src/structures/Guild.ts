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
import { DiscordError } from "../errors/DiscordError.js"
import { channelFactory } from "../functions/channelFactory.js"
import type { IfPartial } from "../types/index.js"
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

	private setField(key: keyof APIGuild, value: unknown) {
		if (!this.rawData)
			throw new Error("Cannot set field without having data... smh")
		Reflect.set(this.rawData, key, value)
	}

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
		return this.rawData.icon
	}

	/**
	 * Get the URL of the guild's icon
	 */
	get iconUrl(): IfPartial<IsPartial, string | null> {
		if (!this.rawData) return undefined as never
		if (!this.icon) return null
		return `https://cdn.discordapp.com/icons/${this.id}/${this.icon}.png`
	}

	/**
	 * The splash hash of the guild.
	 * You can use {@link Guild.splashUrl} to get the URL of the splash.
	 */
	get splash(): IfPartial<IsPartial, string | null> {
		if (!this.rawData) return undefined as never
		return this.rawData.splash
	}

	/**
	 * Get the URL of the guild's splash
	 */
	get splashUrl(): IfPartial<IsPartial, string | null> {
		if (!this.rawData) return undefined as never
		if (!this.splash) return null
		return `https://cdn.discordapp.com/splashes/${this.id}/${this.splash}.png`
	}

	/**
	 * The ID of the owner of the guild.
	 */
	get ownerId(): IfPartial<IsPartial, string> {
		if (!this.rawData) return undefined as never
		return this.rawData.owner_id
	}

	/**
	 * Get all roles in the guild
	 */
	get roles(): IfPartial<IsPartial, Role[]> {
		if (!this.rawData) return undefined as never
		const roles = this.rawData?.roles
		if (!roles) throw new Error("Cannot get roles without having data... smh")
		return roles.map((role) => new Role(this.client, role))
	}

	/**
	 * The preferred locale of the guild.
	 */
	get preferredLocale(): IfPartial<IsPartial, string> {
		if (!this.rawData) return undefined as never
		return this.rawData.preferred_locale
	}

	/**
	 * Fetch updated data for this guild.
	 * If the guild is partial, this will fetch all the data for the guild and populate the fields.
	 * If the guild is not partial, all fields will be updated with new values from Discord.
	 * @param bypassCache Whether to bypass the cache and fetch fresh data
	 * @returns A Promise that resolves to a non-partial Guild
	 */
	async fetch(bypassCache = false): Promise<Guild<false>> {
		// Check cache if client has caching enabled
		if (!bypassCache && this.client.isCaching()) {
			const cachedGuild = await this.client.cache.get("guild", this.id)
			if (cachedGuild) {
				this.setData(cachedGuild.rawData)
				return this as Guild<false>
			}
		}

		const newData = (await this.client.rest.get(
			Routes.guild(this.id)
		)) as APIGuild
		if (!newData) throw new Error(`Guild ${this.id} not found`)

		this.setData(newData)

		// Update cache if client has caching enabled
		if (this.client.isCaching()) {
			await this.client.cache.set("guild", this.id, this as Guild<false>)
		}

		return this as Guild<false>
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
		const roleClass = new Role(this.client, role)
		this.setField(
			"roles",
			Array.isArray(this.roles) ? [...this.roles, roleClass] : [roleClass]
		)
		return roleClass
	}

	/**
	 * Get a member in the guild by ID
	 * @param memberId The ID of the member to fetch
	 * @param bypassCache Whether to bypass the cache and fetch fresh data
	 * @returns A Promise that resolves to a GuildMember or null if not found
	 */
	async fetchMember(
		memberId: string,
		bypassCache = false
	): Promise<GuildMember<false, true> | null> {
		// Check cache if client has caching enabled
		if (!bypassCache && this.client.isCaching()) {
			const cachedMember = await this.client.cache.get(
				"member",
				this.client.cache.createCompositeKey([this.id, memberId])
			)
			if (cachedMember) {
				return cachedMember
			}
		}

		try {
			const partialGuild = new Guild<true>(this.client, this.id)
			const member = (await this.client.rest.get(
				Routes.guildMember(this.id, memberId)
			)) as APIGuildMember
			const memberObject = new GuildMember<false, true>(
				this.client,
				member,
				partialGuild
			)

			if (this.client.isCaching()) {
				await this.client.cache.set(
					"member",
					this.client.cache.createCompositeKey([this.id, memberId]),
					memberObject
				)
			}

			return memberObject
		} catch (e) {
			if (e instanceof DiscordError) {
				if (e.status === 404) return null
			}
			throw e
		}
	}

	/**
	 * Fetch all members in the guild
	 * @param limit The maximum number of members to fetch (max 1000, default 100, set to "all" to fetch all members)
	 * @returns A Promise that resolves to an array of GuildMember objects
	 * @experimental
	 */
	async fetchMembers(
		limit: number | "all" = 100
	): Promise<GuildMember<false, IsPartial>[]> {
		if (limit === "all") {
			const members = []
			let after = undefined
			let hasMore = true
			while (hasMore) {
				const newMembers = (await this.client.rest.get(
					Routes.guildMembers(this.id),
					{
						limit: "1000",
						...(after ? { after } : {})
					}
				)) as APIGuildMember[]
				if (newMembers.length === 0) {
					hasMore = false
				} else {
					members.push(...newMembers)
					after = newMembers[newMembers.length - 1]?.user.id
				}
			}
			const memberObjects = members.map(
				(member) => new GuildMember<false, IsPartial>(this.client, member, this)
			)

			// Update cache if client has caching enabled
			if (this.client.isCaching()) {
				for (const member of memberObjects) {
					const memberData = members.find((m) => m.user.id === member.user.id)
					if (!memberData) continue
					// Create a new member instance with IsPartial=true for the cache
					const cacheMember = new GuildMember<false, true>(
						this.client,
						memberData,
						new Guild<true>(this.client, this.id)
					)
					await this.client.cache.set(
						"member",
						this.client.cache.createCompositeKey([this.id, member.user.id]),
						cacheMember
					)
				}
			}

			return memberObjects
		}
		const cappedLimit = Math.min(limit, 1000)
		const members = (await this.client.rest.get(Routes.guildMembers(this.id), {
			limit: cappedLimit.toString()
		})) as APIGuildMember[]
		const memberObjects = members.map(
			(member) => new GuildMember<false, IsPartial>(this.client, member, this)
		)

		// Update cache if client has caching enabled
		if (this.client.isCaching()) {
			for (const member of memberObjects) {
				const memberData = members.find((m) => m.user.id === member.user.id)
				if (!memberData) continue
				// Create a new member instance with IsPartial=true for the cache
				const cacheMember = new GuildMember<false, true>(
					this.client,
					memberData,
					new Guild<true>(this.client, this.id)
				)
				await this.client.cache.set(
					"member",
					this.client.cache.createCompositeKey([this.id, member.user.id]),
					cacheMember
				)
			}
		}

		return memberObjects
	}

	/**
	 * Fetch a channel from the guild by ID
	 */
	async fetchChannel(channelId: string) {
		try {
			const channel = (await this.client.rest.get(
				Routes.channel(channelId)
			)) as APIChannel
			return channelFactory(this.client, channel)
		} catch (e) {
			if (e instanceof DiscordError) {
				if (e.status === 404) return null
			}
			throw e
		}
	}

	/**
	 * Fetch all channels in the guild
	 * @returns A Promise that resolves to an array of channel objects
	 */
	async fetchChannels(): Promise<ReturnType<typeof channelFactory>[]> {
		const channels = (await this.client.rest.get(
			Routes.guildChannels(this.id)
		)) as APIChannel[]
		const channelObjects = channels.map((channel) =>
			channelFactory(this.client, channel)
		)

		// Update cache if client has caching enabled
		if (this.client.isCaching()) {
			for (const channel of channelObjects) {
				if (!channel) continue
				await this.client.cache.set("channel", channel.id, channel)
			}
		}

		return channelObjects
	}

	/**
	 * Fetch a role from the guild by ID
	 */
	async fetchRole(roleId: string) {
		const role = (await this.client.rest.get(
			Routes.guildRole(this.id, roleId)
		)) as APIRole
		return new Role(this.client, role)
	}

	/**
	 * Fetch all roles in the guild
	 * @returns A Promise that resolves to an array of Role objects
	 */
	async fetchRoles(): Promise<Role[]> {
		const roles = (await this.client.rest.get(
			Routes.guildRoles(this.id)
		)) as APIRole[]
		const roleObjects = roles.map((role) => new Role(this.client, role))

		// Update cache if client has caching enabled
		if (this.client.isCaching()) {
			for (const role of roleObjects) {
				await this.client.cache.set(
					"role",
					this.client.cache.createCompositeKey([this.id, role.id]),
					role
				)
			}
		}

		return roleObjects
	}
}
