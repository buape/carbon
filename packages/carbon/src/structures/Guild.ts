import {
	type APIChannel,
	type APIEmoji,
	type APIGuild,
	type APIGuildMember,
	type APIGuildScheduledEvent,
	type APIGuildWelcomeScreen,
	type APIIncidentsData,
	type APIRole,
	type APISticker,
	type ChannelType,
	type GuildDefaultMessageNotifications,
	type GuildExplicitContentFilter,
	type GuildFeature,
	type GuildHubType,
	type GuildMFALevel,
	type GuildNSFWLevel,
	type GuildPremiumTier,
	type GuildSystemChannelFlags,
	type GuildVerificationLevel,
	type RESTGetAPIGuildMessagesSearchQuery,
	type RESTGetAPIGuildMessagesSearchResult,
	type RESTPostAPIGuildChannelJSONBody,
	type RESTPostAPIGuildRoleJSONBody,
	Routes,
	type ThreadChannelType
} from "discord-api-types/v10"
import { Base } from "../abstracts/Base.js"
import type { Client } from "../classes/Client.js"
import { DiscordError } from "../errors/DiscordError.js"
import { channelFactory } from "../functions/channelFactory.js"
import type { AnyChannel, ChannelTypeMap } from "../types/channels.js"
import type { IfPartial } from "../types/index.js"
import { buildCDNUrl, type CDNUrlOptions } from "../utils/index.js"
import { GuildEmoji } from "./Emoji.js"
import { GuildMember } from "./GuildMember.js"
import {
	GuildScheduledEvent,
	type GuildScheduledEventCreateData
} from "./GuildScheduledEvent.js"
import { GuildThreadChannel } from "./GuildThreadChannel.js"
import { Message } from "./Message.js"
import { Role } from "./Role.js"
import { ThreadMember } from "./ThreadMember.js"

export class Guild<IsPartial extends boolean = false> extends Base {
	constructor(
		client: Client,
		rawDataOrId: IsPartial extends true ? string : APIGuild
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

	protected _rawData: APIGuild | null = null
	private setData(data: typeof this._rawData) {
		if (!data) throw new Error("Cannot set data without having data... smh")
		this._rawData = data
		void this.client.cache.guilds.set(this.id, data)
	}

	private setField(key: keyof APIGuild, value: unknown) {
		if (!this._rawData)
			throw new Error("Cannot set field without having data... smh")
		Reflect.set(this._rawData, key, value)
	}

	/**
	 * The raw Discord API data for this guild
	 */
	get rawData(): Readonly<APIGuild> {
		if (!this._rawData)
			throw new Error(
				"Cannot access rawData on partial Guild. Use fetch() to populate data."
			)
		return this._rawData
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
		return (this._rawData === null) as never
	}

	/**
	 * The name of the guild.
	 */
	get name(): IfPartial<IsPartial, string> {
		if (!this._rawData) return undefined as never
		return this._rawData.name as never
	}

	/**
	 * The description of the guild.
	 */
	get description(): IfPartial<IsPartial, string | null> {
		if (!this._rawData) return undefined as never
		return this._rawData.description as never
	}

	/**
	 * The icon hash of the guild.
	 * You can use {@link Guild.iconUrl} to get the URL of the icon.
	 */
	get icon(): IfPartial<IsPartial, string | null> {
		if (!this._rawData) return undefined as never
		return this._rawData.icon
	}

	/**
	 * Get the URL of the guild's icon with default settings (png format)
	 */
	get iconUrl(): IfPartial<IsPartial, string | null> {
		if (!this._rawData) return undefined as never
		return buildCDNUrl(`https://cdn.discordapp.com/icons/${this.id}`, this.icon)
	}

	/**
	 * Get the URL of the guild's icon with custom format and size options
	 * @param options Optional format and size parameters
	 * @returns The icon URL or null if no icon is set
	 */
	getIconUrl(options?: CDNUrlOptions): IfPartial<IsPartial, string | null> {
		if (!this._rawData) return undefined as never
		return buildCDNUrl(
			`https://cdn.discordapp.com/icons/${this.id}`,
			this.icon,
			options
		)
	}

	/**
	 * The splash hash of the guild.
	 * You can use {@link Guild.splashUrl} to get the URL of the splash.
	 */
	get splash(): IfPartial<IsPartial, string | null> {
		if (!this._rawData) return undefined as never
		return this._rawData.splash
	}

	/**
	 * Get the URL of the guild's splash with default settings (png format)
	 */
	get splashUrl(): IfPartial<IsPartial, string | null> {
		if (!this._rawData) return undefined as never
		return buildCDNUrl(
			`https://cdn.discordapp.com/splashes/${this.id}`,
			this.splash
		)
	}

	/**
	 * Get the URL of the guild's splash with custom format and size options
	 * @param options Optional format and size parameters
	 * @returns The splash URL or null if no splash is set
	 */
	getSplashUrl(options?: CDNUrlOptions): IfPartial<IsPartial, string | null> {
		if (!this._rawData) return undefined as never
		return buildCDNUrl(
			`https://cdn.discordapp.com/splashes/${this.id}`,
			this.splash,
			options
		)
	}

	/**
	 * The ID of the owner of the guild.
	 */
	get ownerId(): IfPartial<IsPartial, string> {
		if (!this._rawData) return undefined as never
		return this._rawData.owner_id
	}

	/**
	 * Get all roles in the guild
	 */
	get roles(): IfPartial<IsPartial, Role[]> {
		if (!this._rawData) return undefined as never
		const roles = this._rawData?.roles
		if (!roles) throw new Error("Cannot get roles without having data... smh")
		return roles.map((role) => new Role(this.client, role, this.id))
	}

	/**
	 * The preferred locale of the guild.
	 */
	get preferredLocale(): IfPartial<IsPartial, string> {
		if (!this._rawData) return undefined as never
		return this._rawData.preferred_locale
	}

	/**
	 * The discovery splash hash of the guild.
	 * You can use {@link Guild.discoverySplashUrl} to get the URL of the discovery splash.
	 */
	get discoverySplash(): IfPartial<IsPartial, string | null> {
		if (!this._rawData) return undefined as never
		return this._rawData.discovery_splash
	}

	/**
	 * Get the URL of the guild's discovery splash with default settings (png format)
	 */
	get discoverySplashUrl(): IfPartial<IsPartial, string | null> {
		if (!this._rawData) return undefined as never
		return buildCDNUrl(
			`https://cdn.discordapp.com/discovery-splashes/${this.id}`,
			this.discoverySplash
		)
	}

	/**
	 * Get the URL of the guild's discovery splash with custom format and size options
	 * @param options Optional format and size parameters
	 * @returns The discovery splash URL or null if no discovery splash is set
	 */
	getDiscoverySplashUrl(
		options?: CDNUrlOptions
	): IfPartial<IsPartial, string | null> {
		if (!this._rawData) return undefined as never
		return buildCDNUrl(
			`https://cdn.discordapp.com/discovery-splashes/${this.id}`,
			this.discoverySplash,
			options
		)
	}

	/**
	 * Whether the user is the owner of the guild
	 */
	get owner(): IfPartial<IsPartial, boolean> {
		if (!this._rawData) return undefined as never
		return this._rawData.owner ?? false
	}

	/**
	 * Total permissions for the user in the guild (excludes overrides)
	 */
	get permissions(): IfPartial<IsPartial, bigint> {
		if (!this._rawData) return undefined as never
		return this._rawData.permissions as never
	}

	/**
	 * ID of afk channel
	 */
	get afkChannelId(): IfPartial<IsPartial, string | null> {
		if (!this._rawData) return undefined as never
		return this._rawData.afk_channel_id
	}

	/**
	 * afk timeout in seconds, can be set to: `60`, `300`, `900`, `1800`, `3600`
	 */
	get afkTimeout(): IfPartial<IsPartial, 1800 | 3600 | 60 | 300 | 900> {
		if (!this._rawData) return undefined as never
		return this._rawData.afk_timeout
	}

	/**
	 * Whether the guild widget is enabled
	 */
	get widgetEnabled(): IfPartial<IsPartial, boolean> {
		if (!this._rawData) return undefined as never
		return this._rawData.widget_enabled ?? false
	}

	/**
	 * The channel id that the widget will generate an invite to, or `null` if set to no invite
	 */
	get widgetChannelId(): IfPartial<IsPartial, string | null> {
		if (!this._rawData) return undefined as never
		return this._rawData.widget_channel_id ?? null
	}

	/**
	 * Verification level required for the guild
	 */
	get verificationLevel(): IfPartial<IsPartial, GuildVerificationLevel> {
		if (!this._rawData) return undefined as never
		return this._rawData.verification_level
	}

	/**
	 * Default message notifications level
	 */
	get defaultMessageNotifications(): IfPartial<
		IsPartial,
		GuildDefaultMessageNotifications
	> {
		if (!this._rawData) return undefined as never
		return this._rawData.default_message_notifications
	}

	/**
	 * Explicit content filter level
	 */
	get explicitContentFilter(): IfPartial<
		IsPartial,
		GuildExplicitContentFilter
	> {
		if (!this._rawData) return undefined as never
		return this._rawData.explicit_content_filter
	}

	/**
	 * Custom guild emojis
	 */
	get emojis(): IfPartial<IsPartial, GuildEmoji[]> {
		if (!this._rawData) return undefined as never
		return this._rawData.emojis.map(
			(emoji) => new GuildEmoji(this.client, emoji, this.id)
		)
	}

	/**
	 * Enabled guild features
	 */
	get features(): IfPartial<IsPartial, GuildFeature[]> {
		if (!this._rawData) return undefined as never
		return this._rawData.features
	}

	/**
	 * Required MFA level for the guild
	 */
	get mfaLevel(): IfPartial<IsPartial, GuildMFALevel> {
		if (!this._rawData) return undefined as never
		return this._rawData.mfa_level
	}

	/**
	 * Application id of the guild creator if it is bot-created
	 */
	get applicationId(): IfPartial<IsPartial, string | null> {
		if (!this._rawData) return undefined as never
		return this._rawData.application_id
	}

	/**
	 * The id of the channel where guild notices such as welcome messages and boost events are posted
	 */
	get systemChannelId(): IfPartial<IsPartial, string | null> {
		if (!this._rawData) return undefined as never
		return this._rawData.system_channel_id
	}

	/**
	 * System channel flags
	 */
	get systemChannelFlags(): IfPartial<IsPartial, GuildSystemChannelFlags> {
		if (!this._rawData) return undefined as never
		return this._rawData.system_channel_flags
	}

	/**
	 * The id of the channel where Community guilds can display rules and/or guidelines
	 */
	get rulesChannelId(): IfPartial<IsPartial, string | null> {
		if (!this._rawData) return undefined as never
		return this._rawData.rules_channel_id
	}

	/**
	 * The maximum number of presences for the guild (`null` is always returned, apart from the largest of guilds)
	 */
	get maxPresences(): IfPartial<IsPartial, number | null> {
		if (!this._rawData) return undefined as never
		return this._rawData.max_presences ?? null
	}

	/**
	 * The maximum number of members for the guild
	 */
	get maxMembers(): IfPartial<IsPartial, number> {
		if (!this._rawData) return undefined as never
		return this._rawData.max_members ?? 0
	}

	/**
	 * The vanity url code for the guild
	 */
	get vanityUrlCode(): IfPartial<IsPartial, string | null> {
		if (!this._rawData) return undefined as never
		return this._rawData.vanity_url_code
	}

	/**
	 * Banner hash
	 * You can use {@link Guild.bannerUrl} to get the URL of the banner.
	 */
	get banner(): IfPartial<IsPartial, string | null> {
		if (!this._rawData) return undefined as never
		return this._rawData.banner
	}

	/**
	 * Get the URL of the guild's banner with default settings (png format)
	 */
	get bannerUrl(): IfPartial<IsPartial, string | null> {
		if (!this._rawData) return undefined as never
		return buildCDNUrl(
			`https://cdn.discordapp.com/banners/${this.id}`,
			this.banner
		)
	}

	/**
	 * Get the URL of the guild's banner with custom format and size options
	 * @param options Optional format and size parameters
	 * @returns The banner URL or null if no banner is set
	 */
	getBannerUrl(options?: CDNUrlOptions): IfPartial<IsPartial, string | null> {
		if (!this._rawData) return undefined as never
		return buildCDNUrl(
			`https://cdn.discordapp.com/banners/${this.id}`,
			this.banner,
			options
		)
	}

	/**
	 * Premium tier (Server Boost level)
	 */
	get premiumTier(): IfPartial<IsPartial, GuildPremiumTier> {
		if (!this._rawData) return undefined as never
		return this._rawData.premium_tier
	}

	/**
	 * The number of boosts this guild currently has
	 */
	get premiumSubscriptionCount(): IfPartial<IsPartial, number> {
		if (!this._rawData) return undefined as never
		return this._rawData.premium_subscription_count ?? 0
	}

	/**
	 * The id of the channel where admins and moderators of Community guilds receive notices from Discord
	 */
	get publicUpdatesChannelId(): IfPartial<IsPartial, string | null> {
		if (!this._rawData) return undefined as never
		return this._rawData.public_updates_channel_id
	}

	/**
	 * The maximum amount of users in a video channel
	 */
	get maxVideoChannelUsers(): IfPartial<IsPartial, number> {
		if (!this._rawData) return undefined as never
		return this._rawData.max_video_channel_users ?? 0
	}

	/**
	 * The maximum amount of users in a stage video channel
	 */
	get maxStageVideoChannelUsers(): IfPartial<IsPartial, number> {
		if (!this._rawData) return undefined as never
		return this._rawData.max_stage_video_channel_users ?? 0
	}

	/**
	 * Approximate number of members in this guild
	 */
	get approximateMemberCount(): IfPartial<IsPartial, number> {
		if (!this._rawData) return undefined as never
		return this._rawData.approximate_member_count ?? 0
	}

	/**
	 * Approximate number of non-offline members in this guild
	 */
	get approximatePresenceCount(): IfPartial<IsPartial, number> {
		if (!this._rawData) return undefined as never
		return this._rawData.approximate_presence_count ?? 0
	}

	/**
	 * The welcome screen of a Community guild, shown to new members
	 */
	get welcomeScreen(): IfPartial<IsPartial, APIGuildWelcomeScreen | undefined> {
		if (!this._rawData) return undefined as never
		return this._rawData.welcome_screen
	}

	/**
	 * The nsfw level of the guild
	 */
	get nsfwLevel(): IfPartial<IsPartial, GuildNSFWLevel> {
		if (!this._rawData) return undefined as never
		return this._rawData.nsfw_level
	}

	/**
	 * Custom guild stickers
	 */
	get stickers(): IfPartial<IsPartial, APISticker[]> {
		if (!this._rawData) return undefined as never
		return this._rawData.stickers ?? []
	}

	/**
	 * Whether the guild has the boost progress bar enabled
	 */
	get premiumProgressBarEnabled(): IfPartial<IsPartial, boolean> {
		if (!this._rawData) return undefined as never
		return this._rawData.premium_progress_bar_enabled
	}

	/**
	 * The type of Student Hub the guild is
	 */
	get hubType(): IfPartial<IsPartial, GuildHubType | null> {
		if (!this._rawData) return undefined as never
		return this._rawData.hub_type
	}

	/**
	 * The id of the channel where admins and moderators of Community guilds receive safety alerts from Discord
	 */
	get safetyAlertsChannelId(): IfPartial<IsPartial, string | null> {
		if (!this._rawData) return undefined as never
		return this._rawData.safety_alerts_channel_id
	}

	/**
	 * The incidents data for this guild
	 */
	get incidentsData(): IfPartial<IsPartial, APIIncidentsData | null> {
		if (!this._rawData) return undefined as never
		return this._rawData.incidents_data
	}

	/**
	 * Fetch updated data for this guild.
	 * If the guild is partial, this will fetch all the data for the guild and populate the fields.
	 * If the guild is not partial, all fields will be updated with new values from Discord.
	 * @returns A Promise that resolves to a non-partial Guild
	 */
	async fetch(): Promise<Guild<false>> {
		const newData = (await this.client.rest.get(
			Routes.guild(this.id)
		)) as APIGuild
		if (!newData) throw new Error(`Guild ${this.id} not found`)

		this.setData(newData)

		return this as Guild<false>
	}

	/**
	 * Leave the guild
	 */
	async leave() {
		await this.client.rest.delete(Routes.guild(this.id))
		await this.client.cache.guilds.delete(this.id)
	}

	/**
	 * Create a channel in the guild
	 */
	async createChannel<
		T extends Exclude<RESTPostAPIGuildChannelJSONBody["type"], undefined> &
			keyof ChannelTypeMap
	>(
		data: Omit<RESTPostAPIGuildChannelJSONBody, "type"> & { type: T }
	): Promise<ChannelTypeMap[T]>
	async createChannel(
		data: Omit<RESTPostAPIGuildChannelJSONBody, "type"> & { type?: undefined }
	): Promise<ChannelTypeMap[ChannelType.GuildText]>
	async createChannel(
		data: RESTPostAPIGuildChannelJSONBody
	): Promise<AnyChannel> {
		const channel = (await this.client.rest.post(
			Routes.guildChannels(this.id),
			{
				body: {
					...data
				}
			}
		)) as APIChannel
		await this.client.cache.channels.set(channel.id, channel)

		return channelFactory(this.client, channel)
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
		const roleClass = new Role(this.client, role, this.id)
		this.setField(
			"roles",
			Array.isArray(this.roles) ? [...this.roles, roleClass] : [roleClass]
		)
		return roleClass
	}

	/**
	 * Get a member in the guild by ID
	 * @param memberId The ID of the member to fetch
	 * @param force Whether to bypass cache and request fresh data from Discord
	 * @returns A Promise that resolves to a GuildMember or null if not found
	 */
	async fetchMember(
		memberId: string,
		force: boolean = false
	): Promise<GuildMember<false, true> | null> {
		try {
			return await this.client.fetchMember(this.id, memberId, force)
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
			let after: string | undefined
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

			return memberObjects
		}
		const cappedLimit = Math.min(limit, 1000)
		const members = (await this.client.rest.get(Routes.guildMembers(this.id), {
			limit: cappedLimit.toString()
		})) as APIGuildMember[]
		const memberObjects = members.map(
			(member) => new GuildMember<false, IsPartial>(this.client, member, this)
		)

		return memberObjects
	}

	/**
	 * Fetch a channel from the guild by ID
	 * @param channelId The ID of the channel to fetch
	 * @param force Whether to bypass cache and request fresh data from Discord
	 */
	async fetchChannel(channelId: string, force: boolean = false) {
		try {
			return await this.client.fetchChannel(channelId, force)
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
	async fetchChannels(): Promise<AnyChannel[]> {
		const channels = (await this.client.rest.get(
			Routes.guildChannels(this.id)
		)) as APIChannel[]
		await Promise.all(
			channels.map((channel) =>
				this.client.cache.channels.set(channel.id, channel)
			)
		)
		const channelObjects = channels.map((channel) =>
			channelFactory(this.client, channel)
		)

		return channelObjects
	}

	/**
	 * Search for messages in the guild.
	 *
	 * @remarks
	 * The Search Guild Messages endpoint is restricted according to whether the MESSAGE_CONTENT Privileged Intent is enabled for your application.
	 *
	 * If the entity you are searching is not yet indexed, the endpoint will return a 202 accepted response. The response body will not contain any search results, and will look similar to an error response:
	 * ```json
	 * {
	 *   "message": "Index not yet available. Try again later",
	 *   "code": 110000,
	 *   "documents_indexed": 0,
	 *   "retry_after": 2
	 * }
	 * ```
	 *
	 * @param options Search filters and pagination options
	 */
	async searchMessages(options?: RESTGetAPIGuildMessagesSearchQuery): Promise<
		| Extract<RESTGetAPIGuildMessagesSearchResult, { message: string }>
		| (Omit<
				Extract<RESTGetAPIGuildMessagesSearchResult, { messages: unknown }>,
				"messages" | "threads" | "members"
		  > & {
				messages: Message<false>[][]
				threads?: GuildThreadChannel<ThreadChannelType>[]
				members?: ThreadMember[]
				raw: Pick<
					Extract<RESTGetAPIGuildMessagesSearchResult, { messages: unknown }>,
					"threads" | "members"
				>
		  })
	> {
		const queryParams: Record<
			string,
			string | number | boolean | readonly string[]
		> = {}
		if (options?.limit !== undefined) queryParams.limit = options.limit
		if (options?.offset !== undefined) queryParams.offset = options.offset
		if (options?.max_id !== undefined) queryParams.max_id = options.max_id
		if (options?.min_id !== undefined) queryParams.min_id = options.min_id
		if (options?.slop !== undefined) queryParams.slop = options.slop
		if (options?.content !== undefined) queryParams.content = options.content
		if (options?.channel_id !== undefined)
			queryParams.channel_id = options.channel_id
		if (options?.author_type !== undefined)
			queryParams.author_type = options.author_type
		if (options?.author_id !== undefined)
			queryParams.author_id = options.author_id
		if (options?.mentions !== undefined) queryParams.mentions = options.mentions
		if (options?.mentions_role_id !== undefined)
			queryParams.mentions_role_id = options.mentions_role_id
		if (options?.mention_everyone !== undefined)
			queryParams.mention_everyone = options.mention_everyone
		if (options?.replied_to_user_id !== undefined)
			queryParams.replied_to_user_id = options.replied_to_user_id
		if (options?.replied_to_message_id !== undefined)
			queryParams.replied_to_message_id = options.replied_to_message_id
		if (options?.pinned !== undefined) queryParams.pinned = options.pinned
		if (options?.has !== undefined) queryParams.has = options.has
		if (options?.embed_type !== undefined)
			queryParams.embed_type = options.embed_type
		if (options?.embed_provider !== undefined)
			queryParams.embed_provider = options.embed_provider
		if (options?.link_hostname !== undefined)
			queryParams.link_hostname = options.link_hostname
		if (options?.attachment_filename !== undefined)
			queryParams.attachment_filename = options.attachment_filename
		if (options?.attachment_extension !== undefined)
			queryParams.attachment_extension = options.attachment_extension
		if (options?.sort_by !== undefined) queryParams.sort_by = options.sort_by
		if (options?.sort_order !== undefined)
			queryParams.sort_order = options.sort_order
		if (options?.include_nsfw !== undefined)
			queryParams.include_nsfw = options.include_nsfw

		const result = (await this.client.rest.get(
			Routes.guildMessagesSearch(this.id),
			Object.keys(queryParams).length > 0 ? queryParams : undefined
		)) as RESTGetAPIGuildMessagesSearchResult

		if ("messages" in result) {
			return {
				...result,
				messages: result.messages.map((messages) =>
					messages.map((message) => new Message(this.client, message))
				),
				threads: result.threads?.map(
					(thread) => new GuildThreadChannel(this.client, thread)
				),
				members: result.members?.map(
					(member) => new ThreadMember(this.client, member, this.id)
				),
				raw: {
					threads: result.threads,
					members: result.members
				}
			}
		}

		return result
	}

	/**
	 * Fetch a role from the guild by ID
	 * @param roleId The ID of the role to fetch
	 * @param force Whether to bypass cache and request fresh data from Discord
	 */
	async fetchRole(roleId: string, force: boolean = false) {
		return this.client.fetchRole(this.id, roleId, force)
	}

	/**
	 * Fetch all roles in the guild
	 * @returns A Promise that resolves to an array of Role objects
	 */
	async fetchRoles(): Promise<Role[]> {
		const roles = (await this.client.rest.get(
			Routes.guildRoles(this.id)
		)) as APIRole[]
		const roleObjects = roles.map(
			(role) => new Role(this.client, role, this.id)
		)

		return roleObjects
	}

	public async getEmoji(
		id: string,
		force: boolean = false
	): Promise<GuildEmoji> {
		const key = `${this.id}:${id}`
		const cached = force ? undefined : await this.client.cache.emojis.get(key)
		if (cached) return new GuildEmoji(this.client, cached, this.id)
		const emoji = (await this.client.rest.get(
			Routes.guildEmoji(this.id, id)
		)) as APIEmoji
		return new GuildEmoji(this.client, emoji, this.id)
	}

	public getEmojiByName(name: string): GuildEmoji | undefined {
		const emojis = this.emojis
		return emojis?.find((emoji) => emoji.name === name)
	}

	/**
	 * Upload a new emoji to the application
	 * @param name The name of the emoji
	 * @param image The image of the emoji in base64 format
	 * @returns The created ApplicationEmoji
	 */
	public async createEmoji(name: string, image: string) {
		const emoji = (await this.client.rest.post(Routes.guildEmojis(this.id), {
			body: { name, image }
		})) as APIEmoji
		return new GuildEmoji(this.client, emoji, this.id)
	}

	public async deleteEmoji(id: string) {
		await this.client.rest.delete(Routes.guildEmoji(this.id, id))
		await this.client.cache.deleteEmoji(this.id, id)
	}

	/**
	 * Fetch all scheduled events for the guild
	 * @param withUserCount Whether to include the user count in the response
	 * @returns A Promise that resolves to an array of GuildScheduledEvent objects
	 */
	async fetchScheduledEvents(
		withUserCount = false
	): Promise<GuildScheduledEvent<false>[]> {
		const scheduledEvents = (await this.client.rest.get(
			Routes.guildScheduledEvents(this.id),
			withUserCount ? { with_user_count: "true" } : undefined
		)) as APIGuildScheduledEvent[]

		return scheduledEvents.map(
			(event) => new GuildScheduledEvent(this.client, event, this.id)
		)
	}

	/**
	 * Fetch a specific scheduled event by ID
	 * @param eventId The ID of the scheduled event to fetch
	 * @param withUserCount Whether to include the user count in the response
	 * @param force Whether to bypass cache and request fresh data from Discord
	 * @returns A Promise that resolves to a GuildScheduledEvent or null if not found
	 */
	async fetchScheduledEvent(
		eventId: string,
		withUserCount = false,
		force: boolean = false
	): Promise<GuildScheduledEvent<false> | null> {
		try {
			const key = `${this.id}:${eventId}`
			const cached = force
				? undefined
				: await this.client.cache.scheduledEvents.get(key)
			if (cached && !withUserCount)
				return new GuildScheduledEvent(this.client, cached, this.id)
			const scheduledEvent = (await this.client.rest.get(
				Routes.guildScheduledEvent(this.id, eventId),
				withUserCount ? { with_user_count: "true" } : undefined
			)) as APIGuildScheduledEvent

			return new GuildScheduledEvent(this.client, scheduledEvent, this.id)
		} catch (e) {
			if (e instanceof DiscordError) {
				if (e.status === 404) return null
			}
			throw e
		}
	}

	/**
	 * Create a new scheduled event
	 * @param data The data for the scheduled event
	 * @returns A Promise that resolves to the created GuildScheduledEvent
	 */
	async createScheduledEvent(
		data: GuildScheduledEventCreateData
	): Promise<GuildScheduledEvent<false>> {
		const scheduledEvent = (await this.client.rest.post(
			Routes.guildScheduledEvents(this.id),
			{
				body: {
					name: data.name,
					description: data.description ?? null,
					scheduled_start_time: data.scheduledStartTime,
					scheduled_end_time: data.scheduledEndTime ?? null,
					privacy_level: data.privacyLevel,
					entity_type: data.entityType,
					channel_id: data.channelId ?? null,
					entity_metadata: data.entityMetadata,
					image: data.image ?? null
				}
			}
		)) as APIGuildScheduledEvent

		return new GuildScheduledEvent(this.client, scheduledEvent, this.id)
	}

	/**
	 * Edit a scheduled event
	 * @param eventId The ID of the scheduled event to edit
	 * @param data The data to update the scheduled event with
	 * @returns A Promise that resolves to the updated GuildScheduledEvent
	 */
	async editScheduledEvent(
		eventId: string,
		data: Partial<GuildScheduledEventCreateData>
	): Promise<GuildScheduledEvent<false>> {
		const body: Record<string, unknown> = {}
		if (data.name !== undefined) body.name = data.name
		if (data.description !== undefined) body.description = data.description
		if (data.scheduledStartTime !== undefined)
			body.scheduled_start_time = data.scheduledStartTime
		if (data.scheduledEndTime !== undefined)
			body.scheduled_end_time = data.scheduledEndTime
		if (data.privacyLevel !== undefined) body.privacy_level = data.privacyLevel
		if (data.entityType !== undefined) body.entity_type = data.entityType
		if (data.channelId !== undefined) body.channel_id = data.channelId
		if (data.entityMetadata !== undefined)
			body.entity_metadata = data.entityMetadata
		if (data.image !== undefined) body.image = data.image

		const scheduledEvent = (await this.client.rest.patch(
			Routes.guildScheduledEvent(this.id, eventId),
			{ body }
		)) as APIGuildScheduledEvent

		return new GuildScheduledEvent(this.client, scheduledEvent, this.id)
	}

	/**
	 * Delete a scheduled event
	 * @param eventId The ID of the scheduled event to delete
	 */
	async deleteScheduledEvent(eventId: string): Promise<void> {
		await this.client.rest.delete(Routes.guildScheduledEvent(this.id, eventId))
		await this.client.cache.scheduledEvents.delete(`${this.id}:${eventId}`)
	}

	/**
	 * Get member counts for each role in the guild
	 * @returns A Promise that resolves to an array of objects containing role ID, partial Role, and member count
	 */
	async fetchRoleMemberCounts(): Promise<
		Array<{ id: string; role: Role<true>; count: number }>
	> {
		const memberCounts = (await this.client.rest.get(
			`/guilds/${this.id}/roles/member-counts`
		)) as Record<string, number>

		return Object.entries(memberCounts).map(([roleId, count]) => ({
			id: roleId,
			role: new Role<true>(this.client, roleId, this.id),
			count
		}))
	}
}
