import {
	type APIChannel,
	type APIEmoji,
	type APIGuild,
	type APIGuildMember,
	type APIGuildWelcomeScreen,
	type APIIncidentsData,
	type APIRole,
	type APISticker,
	type GuildDefaultMessageNotifications,
	type GuildExplicitContentFilter,
	type GuildFeature,
	type GuildHubType,
	type GuildMFALevel,
	type GuildNSFWLevel,
	type GuildPremiumTier,
	type GuildSystemChannelFlags,
	type GuildVerificationLevel,
	type RESTPostAPIGuildRoleJSONBody,
	Routes
} from "discord-api-types/v10"
import { Base } from "../abstracts/Base.js"
import type { Client } from "../classes/Client.js"
import { DiscordError } from "../errors/DiscordError.js"
import { channelFactory } from "../functions/channelFactory.js"
import type { IfPartial } from "../types/index.js"
import { buildCDNUrl, type CDNUrlOptions } from "../utils/index.js"
import { GuildEmoji } from "./Emoji.js"
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
			this._rawData = rawDataOrId
			this.id = rawDataOrId.id
			this.setData(rawDataOrId)
		}
	}

	protected _rawData: APIGuild | null = null
	private setData(data: typeof this._rawData) {
		if (!data) throw new Error("Cannot set data without having data... smh")
		this._rawData = data
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
	 * Get the URL of the guild's icon
	 * @param options - Optional format and size parameters
	 * @returns The icon URL, or null if no icon is set
	 */
	iconUrl(options?: CDNUrlOptions): IfPartial<IsPartial, string | null> {
		if (!this._rawData) return undefined as never
		return buildCDNUrl("icons", this.id, this.icon, options)
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
	 * Get the URL of the guild's splash
	 * @param options - Optional format and size parameters
	 * @returns The splash URL, or null if no splash is set
	 */
	splashUrl(options?: CDNUrlOptions): IfPartial<IsPartial, string | null> {
		if (!this._rawData) return undefined as never
		return buildCDNUrl("splashes", this.id, this.splash, options)
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
		return roles.map((role) => new Role(this.client, role))
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
	 * Get the URL of the guild's discovery splash
	 * @param options - Optional format and size parameters
	 * @returns The discovery splash URL, or null if no discovery splash is set
	 */
	discoverySplashUrl(options?: CDNUrlOptions): IfPartial<IsPartial, string | null> {
		if (!this._rawData) return undefined as never
		return buildCDNUrl("discovery-splashes", this.id, this.discoverySplash, options)
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
	 * Get the URL of the guild's banner
	 * @param options - Optional format and size parameters
	 * @returns The banner URL, or null if no banner is set
	 */
	bannerUrl(options?: CDNUrlOptions): IfPartial<IsPartial, string | null> {
		if (!this._rawData) return undefined as never
		return buildCDNUrl("banners", this.id, this.banner, options)
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
		return this._rawData.stickers
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
	 * @returns A Promise that resolves to a GuildMember or null if not found
	 */
	async fetchMember(
		memberId: string
	): Promise<GuildMember<false, true> | null> {
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

		return roleObjects
	}

	public async getEmoji(id: string): Promise<GuildEmoji> {
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
	}
}
