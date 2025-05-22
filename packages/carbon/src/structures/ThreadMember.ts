import type { APIThreadMember, ThreadMemberFlags } from "discord-api-types/v10"
import { Base } from "../abstracts/Base.js"
import type { Client } from "../classes/Client.js"
import { Guild } from "./Guild.js"
import { GuildMember } from "./GuildMember.js"
import { User } from "./User.js"

export class ThreadMember extends Base {
	constructor(client: Client, rawData: APIThreadMember, guildId?: string) {
		super(client)
		this.rawData = rawData
		this.setData(rawData)
		this.guildId = guildId
	}

	protected rawData: APIThreadMember | null = null
	private setData(data: typeof this.rawData) {
		if (!data) throw new Error("Cannot set data without having data... smh")
		this.rawData = data
	}

	/**
	 * The ID of the guild. This is not present in the API response, so it must be provided.
	 */
	public guildId: string | undefined

	/**
	 * The ID of the thread
	 */
	get id(): string | undefined {
		if (!this.rawData) return undefined as never
		return this.rawData.id
	}
	/**
	 * The ID of the user
	 */
	get userId(): string | undefined {
		if (!this.rawData) return undefined as never
		return this.rawData.user_id
	}
	get user(): User<true> | undefined {
		if (!this.userId) return undefined
		return new User<true>(this.client, this.userId)
	}
	/**
	 * The timestamp of when the user last joined the thread
	 */
	get joinTimestamp(): string {
		if (!this.rawData) return undefined as never
		return this.rawData.join_timestamp
	}
	/**
	 * 	Any user-thread settings, currently only used for notifications
	 */
	get flags(): ThreadMemberFlags {
		if (!this.rawData) return undefined as never
		return this.rawData.flags
	}
	/**
	 * The member object of the user
	 */
	member(guildId?: string): GuildMember<false, true> | undefined {
		if (!this.rawData?.member || !this.user) return undefined
		// biome-ignore lint/style/noParameterAssign:
		guildId = guildId ?? this.guildId
		if (!guildId)
			throw new Error("Cannot create GuildMember without a guild ID")
		return new GuildMember<false, true>(
			this.client,
			this.rawData.member,
			new Guild<true>(this.client, guildId)
		)
	}
}
