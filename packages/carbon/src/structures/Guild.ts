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

	protected rawData: APIGuild | null = null
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
	 * The discovery splash hash of the guild.
	 * You can use {@link Guild.discoverySplashUrl} to get the URL of the discovery splash.
	 */
	get discoverySplash(): IfPartial<IsPartial, string | null> {
		if (!this.rawData) return undefined as never
		return this.rawData.discovery_splash
	}

	/**
	 * Get the URL of the guild's discovery splash
	 */
	get discoverySplashUrl(): IfPartial<IsPartial, string | null> {
		if (!this.rawData) return undefined as never
		if (!this.discoverySplash) return null
		return `https://cdn.discordapp.com/discovery-splashes/${this.id}/${this.discoverySplash}.png`
	}

	/**
	 * Whether the user is the owner of the guild
	 */
	get owner(): IfPartial<IsPartial, boolean> {
		if (!this.rawData) return undefined as never
		return this.rawData.owner ?? false
	}

	/**
	 * Total permissions for the user in the guild (excludes overrides)
	 */
	get permissions(): IfPartial<IsPartial, bigint> {
		if (!this.rawData) return undefined as never
		return this.rawData.permissions as never
	}

	/**
	 * ID of afk channel
	 */
	get afkChannelId(): IfPartial<IsPartial, string | null> {
		if (!this.rawData) return undefined as never
		return this.rawData.afk_channel_id
	}

	/**
	 * afk timeout in seconds, can be set to: `60`, `300`, `900`, `1800`, `3600`
	 */
	get afkTimeout(): IfPartial<IsPartial, 1800 | 3600 | 60 | 300 | 900> {
		if (!this.rawData) return undefined as never
		return this.rawData.afk_timeout
	}

	/**
	 * Whether the guild widget is enabled
	 */
	get widgetEnabled(): IfPartial<IsPartial, boolean> {
		if (!this.rawData) return undefined as never
		return this.rawData.widget_enabled ?? false
	}

	/**
	 * The channel id that the widget will generate an invite to, or `null` if set to no invite
	 */
	get widgetChannelId(): IfPartial<IsPartial, string | null> {
		if (!this.rawData) return undefined as never
		return this.rawData.widget_channel_id ?? null
	}

	/**
	 * Verification level required for the guild
	 */
	get verificationLevel(): IfPartial<IsPartial, GuildVerificationLevel> {
		if (!this.rawData) return undefined as never
		return this.rawData.verification_level
	}

	/**
	 * Default message notifications level
	 */
	get defaultMessageNotifications(): IfPartial<
		IsPartial,
		GuildDefaultMessageNotifications
	> {
		if (!this.rawData) return undefined as never
		return this.rawData.default_message_notifications
	}

	/**
	 * Explicit content filter level
	 */
	get explicitContentFilter(): IfPartial<
		IsPartial,
		GuildExplicitContentFilter
	> {
		if (!this.rawData) return undefined as never
		return this.rawData.explicit_content_filter
	}

	/**
	 * Custom guild emojis
	 */
	get emojis(): IfPartial<IsPartial, APIEmoji[]> {
		if (!this.rawData) return undefined as never
		return this.rawData.emojis
	}

	/**
	 * Enabled guild features
	 */
	get features(): IfPartial<IsPartial, GuildFeature[]> {
		if (!this.rawData) return undefined as never
		return this.rawData.features
	}

	/**
	 * Required MFA level for the guild
	 */
	get mfaLevel(): IfPartial<IsPartial, GuildMFALevel> {
		if (!this.rawData) return undefined as never
		return this.rawData.mfa_level
	}

	/**
	 * Application id of the guild creator if it is bot-created
	 */
	get applicationId(): IfPartial<IsPartial, string | null> {
		if (!this.rawData) return undefined as never
		return this.rawData.application_id
	}

	/**
	 * The id of the channel where guild notices such as welcome messages and boost events are posted
	 */
	get systemChannelId(): IfPartial<IsPartial, string | null> {
		if (!this.rawData) return undefined as never
		return this.rawData.system_channel_id
	}

	/**
	 * System channel flags
	 */
	get systemChannelFlags(): IfPartial<IsPartial, GuildSystemChannelFlags> {
		if (!this.rawData) return undefined as never
		return this.rawData.system_channel_flags
	}

	/**
	 * The id of the channel where Community guilds can display rules and/or guidelines
	 */
	get rulesChannelId(): IfPartial<IsPartial, string | null> {
		if (!this.rawData) return undefined as never
		return this.rawData.rules_channel_id
	}

	/**
	 * The maximum number of presences for the guild (`null` is always returned, apart from the largest of guilds)
	 */
	get maxPresences(): IfPartial<IsPartial, number | null> {
		if (!this.rawData) return undefined as never
		return this.rawData.max_presences ?? null
	}

	/**
	 * The maximum number of members for the guild
	 */
	get maxMembers(): IfPartial<IsPartial, number> {
		if (!this.rawData) return undefined as never
		return this.rawData.max_members ?? 0
	}

	/**
	 * The vanity url code for the guild
	 */
	get vanityUrlCode(): IfPartial<IsPartial, string | null> {
		if (!this.rawData) return undefined as never
		return this.rawData.vanity_url_code
	}

	/**
	 * Banner hash
	 * You can use {@link Guild.bannerUrl} to get the URL of the banner.
	 */
	get banner(): IfPartial<IsPartial, string | null> {
		if (!this.rawData) return undefined as never
		return this.rawData.banner
	}

	/**
	 * Get the URL of the guild's banner
	 */
	get bannerUrl(): IfPartial<IsPartial, string | null> {
		if (!this.rawData) return undefined as never
		if (!this.banner) return null
		return `https://cdn.discordapp.com/banners/${this.id}/${this.banner}.png`
	}

	/**
	 * Premium tier (Server Boost level)
	 */
	get premiumTier(): IfPartial<IsPartial, GuildPremiumTier> {
		if (!this.rawData) return undefined as never
		return this.rawData.premium_tier
	}

	/**
	 * The number of boosts this guild currently has
	 */
	get premiumSubscriptionCount(): IfPartial<IsPartial, number> {
		if (!this.rawData) return undefined as never
		return this.rawData.premium_subscription_count ?? 0
	}

	/**
	 * The id of the channel where admins and moderators of Community guilds receive notices from Discord
	 */
	get publicUpdatesChannelId(): IfPartial<IsPartial, string | null> {
		if (!this.rawData) return undefined as never
		return this.rawData.public_updates_channel_id
	}

	/**
	 * The maximum amount of users in a video channel
	 */
	get maxVideoChannelUsers(): IfPartial<IsPartial, number> {
		if (!this.rawData) return undefined as never
		return this.rawData.max_video_channel_users ?? 0
	}

	/**
	 * The maximum amount of users in a stage video channel
	 */
	get maxStageVideoChannelUsers(): IfPartial<IsPartial, number> {
		if (!this.rawData) return undefined as never
		return this.rawData.max_stage_video_channel_users ?? 0
	}

	/**
	 * Approximate number of members in this guild
	 */
	get approximateMemberCount(): IfPartial<IsPartial, number> {
		if (!this.rawData) return undefined as never
		return this.rawData.approximate_member_count ?? 0
	}

	/**
	 * Approximate number of non-offline members in this guild
	 */
	get approximatePresenceCount(): IfPartial<IsPartial, number> {
		if (!this.rawData) return undefined as never
		return this.rawData.approximate_presence_count ?? 0
	}

	/**
	 * The welcome screen of a Community guild, shown to new members
	 */
	get welcomeScreen(): IfPartial<IsPartial, APIGuildWelcomeScreen | undefined> {
		if (!this.rawData) return undefined as never
		return this.rawData.welcome_screen
	}

	/**
	 * The nsfw level of the guild
	 */
	get nsfwLevel(): IfPartial<IsPartial, GuildNSFWLevel> {
		if (!this.rawData) return undefined as never
		return this.rawData.nsfw_level
	}

	/**
	 * Custom guild stickers
	 */
	get stickers(): IfPartial<IsPartial, APISticker[]> {
		if (!this.rawData) return undefined as never
		return this.rawData.stickers
	}

	/**
	 * Whether the guild has the boost progress bar enabled
	 */
	get premiumProgressBarEnabled(): IfPartial<IsPartial, boolean> {
		if (!this.rawData) return undefined as never
		return this.rawData.premium_progress_bar_enabled
	}

	/**
	 * The type of Student Hub the guild is
	 */
	get hubType(): IfPartial<IsPartial, GuildHubType | null> {
		if (!this.rawData) return undefined as never
		return this.rawData.hub_type
	}

	/**
	 * The id of the channel where admins and moderators of Community guilds receive safety alerts from Discord
	 */
	get safetyAlertsChannelId(): IfPartial<IsPartial, string | null> {
		if (!this.rawData) return undefined as never
		return this.rawData.safety_alerts_channel_id
	}

	/**
	 * The incidents data for this guild
	 */
	get incidentsData(): IfPartial<IsPartial, APIIncidentsData | null> {
		if (!this.rawData) return undefined as never
		return this.rawData.incidents_data
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
}
