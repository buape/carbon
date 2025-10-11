import {
	type APIGuildScheduledEvent,
	type GuildScheduledEventEntityType,
	type GuildScheduledEventPrivacyLevel,
	type GuildScheduledEventStatus,
	type RESTGetAPIGuildScheduledEventUsersQuery,
	type RESTGetAPIGuildScheduledEventUsersResult,
	Routes
} from "discord-api-types/v10"
import { Base } from "../abstracts/Base.js"
import type { Client } from "../classes/Client.js"
import type { IfPartial } from "../types/index.js"
import { Guild } from "./Guild.js"
import { User } from "./User.js"

export type GuildScheduledEventCreateData = {
	name: string
	description?: string | null
	scheduledStartTime: string
	scheduledEndTime?: string | null
	privacyLevel: GuildScheduledEventPrivacyLevel
	entityType: GuildScheduledEventEntityType
	channelId?: string | null
	entityMetadata?: {
		location?: string | null | undefined
	} | null
	image?: string | null
}

export class GuildScheduledEvent<
	IsPartial extends boolean = false
> extends Base {
	constructor(
		client: Client,
		rawDataOrId: IsPartial extends true ? string : APIGuildScheduledEvent,
		guildId: string
	) {
		super(client)
		if (typeof rawDataOrId === "string") {
			this.id = rawDataOrId
			this.guildId = guildId
		} else {
			this._rawData = rawDataOrId
			this.id = rawDataOrId.id
			this.guildId = rawDataOrId.guild_id
			this.setData(rawDataOrId)
		}
	}

	protected _rawData: APIGuildScheduledEvent | null = null
	private setData(data: typeof this._rawData) {
		if (!data) throw new Error("Cannot set data without having data... smh")
		this._rawData = data
	}

	/**
	 * The raw Discord API data for this scheduled event
	 */
	get rawData(): Readonly<APIGuildScheduledEvent> {
		if (!this._rawData)
			throw new Error(
				"Cannot access rawData on partial GuildScheduledEvent. Use fetch() to populate data."
			)
		return this._rawData
	}

	/**
	 * The ID of the scheduled event
	 */
	readonly id: string

	/**
	 * The ID of the guild this scheduled event belongs to
	 */
	readonly guildId: string

	/**
	 * Whether the scheduled event is a partial scheduled event (meaning it does not have all the data).
	 * If this is true, you should use {@link GuildScheduledEvent.fetch} to get the full data of the scheduled event.
	 */
	get partial(): IfPartial<IsPartial, false, true> {
		return (this._rawData === null) as never
	}

	/**
	 * The name of the scheduled event
	 */
	get name(): IfPartial<IsPartial, string> {
		if (!this._rawData) return undefined as never
		return this._rawData.name
	}

	/**
	 * The description of the scheduled event
	 */
	get description(): IfPartial<IsPartial, string | null | undefined> {
		if (!this._rawData) return undefined as never
		return this._rawData.description
	}

	/**
	 * The time the scheduled event will start
	 */
	get scheduledStartTime(): IfPartial<IsPartial, string> {
		if (!this._rawData) return undefined as never
		return this._rawData.scheduled_start_time
	}

	/**
	 * The time the scheduled event will end, or null if the event does not have a scheduled end time
	 */
	get scheduledEndTime(): IfPartial<IsPartial, string | null> {
		if (!this._rawData) return undefined as never
		return this._rawData.scheduled_end_time
	}

	/**
	 * The privacy level of the scheduled event
	 */
	get privacyLevel(): IfPartial<IsPartial, GuildScheduledEventPrivacyLevel> {
		if (!this._rawData) return undefined as never
		return this._rawData.privacy_level
	}

	/**
	 * The status of the scheduled event
	 */
	get status(): IfPartial<IsPartial, GuildScheduledEventStatus> {
		if (!this._rawData) return undefined as never
		return this._rawData.status
	}

	/**
	 * The type of the scheduled event
	 */
	get entityType(): IfPartial<IsPartial, GuildScheduledEventEntityType> {
		if (!this._rawData) return undefined as never
		return this._rawData.entity_type
	}

	/**
	 * The ID of the channel where the scheduled event will be hosted, or null if entity_type is EXTERNAL
	 */
	get channelId(): IfPartial<IsPartial, string | null> {
		if (!this._rawData) return undefined as never
		return this._rawData.channel_id
	}

	/**
	 * Additional metadata for the scheduled event
	 */
	get entityMetadata(): IfPartial<
		IsPartial,
		APIGuildScheduledEvent["entity_metadata"]
	> {
		if (!this._rawData) return undefined as never
		return this._rawData.entity_metadata
	}

	/**
	 * The user that created the scheduled event
	 */
	get creator(): IfPartial<IsPartial, User | null> {
		if (!this._rawData) return undefined as never
		return this._rawData.creator
			? new User(this.client, this._rawData.creator)
			: null
	}

	/**
	 * The number of users subscribed to the scheduled event
	 */
	get userCount(): IfPartial<IsPartial, number | undefined> {
		if (!this._rawData) return undefined as never
		return this._rawData.user_count
	}

	/**
	 * The cover image hash of the scheduled event
	 */
	get image(): IfPartial<IsPartial, string | null | undefined> {
		if (!this._rawData) return undefined as never
		return this._rawData.image
	}

	/**
	 * Get the URL of the scheduled event's cover image
	 */
	get imageUrl(): IfPartial<IsPartial, string | null> {
		if (!this._rawData) return undefined as never
		if (!this.image) return null
		return `https://cdn.discordapp.com/guild-events/${this.id}/${this.image}.png`
	}

	/**
	 * Fetch updated data for this scheduled event.
	 * If the scheduled event is partial, this will fetch all the data for the scheduled event and populate the fields.
	 * If the scheduled event is not partial, all fields will be updated with new values from Discord.
	 * @returns A Promise that resolves to a non-partial GuildScheduledEvent
	 */
	async fetch(): Promise<GuildScheduledEvent<false>> {
		const newData = (await this.client.rest.get(
			Routes.guildScheduledEvent(this.guildId, this.id)
		)) as APIGuildScheduledEvent
		if (!newData) throw new Error(`Scheduled event ${this.id} not found`)

		this.setData(newData)

		return this as GuildScheduledEvent<false>
	}

	/**
	 * Edit the scheduled event
	 * @param data The data to update the scheduled event with
	 * @returns A Promise that resolves to the updated scheduled event
	 */
	async edit(
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

		const updatedData = (await this.client.rest.patch(
			Routes.guildScheduledEvent(this.guildId, this.id),
			{ body }
		)) as APIGuildScheduledEvent

		this.setData(updatedData)
		return this as GuildScheduledEvent<false>
	}

	/**
	 * Delete the scheduled event
	 */
	async delete(): Promise<void> {
		await this.client.rest.delete(
			Routes.guildScheduledEvent(this.guildId, this.id)
		)
	}

	/**
	 * Get the guild this scheduled event belongs to
	 */
	async getGuild(): Promise<Guild<false>> {
		const guild = new Guild<true>(this.client, this.guildId)
		return await guild.fetch()
	}

	/**
	 * Fetch the users subscribed to this scheduled event
	 * @param options The options for fetching the users
	 * @returns A Promise that resolves to an array of Users
	 */
	async fetchUsers(
		options?: Omit<RESTGetAPIGuildScheduledEventUsersQuery, "with_member">
	) {
		const queryParams: Record<string, string | number> = {}
		if (options?.before) queryParams.before = options.before
		if (options?.after) queryParams.after = options.after
		if (options?.limit) queryParams.limit = options.limit.toString()

		const result = (await this.client.rest.get(
			Routes.guildScheduledEventUsers(this.guildId, this.id),
			queryParams
		)) as RESTGetAPIGuildScheduledEventUsersResult

		return result.map((userData) => new User(this.client, userData.user))
	}
}
