import {
	type APIDMChannel,
	type APIMessage,
	type APIUser,
	Routes,
	type UserFlags
} from "discord-api-types/v10"
import { Base } from "../abstracts/Base.js"
import type { Client } from "../classes/Client.js"
import type { MessagePayload } from "../types/index.js"
import type { IfPartial } from "../types/index.js"
import { serializePayload } from "../utils/index.js"
import { Message } from "./Message.js"

export class User<IsPartial extends boolean = false> extends Base {
	constructor(
		client: Client,
		rawDataOrId: IsPartial extends true ? string : APIUser
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

	protected _rawData: APIUser | null = null
	get rawData(): Readonly<APIUser> {
		if (!this._rawData)
			throw new Error("Cannot get data without having data... smh")
		return this._rawData
	}
	private setData(data: typeof this._rawData) {
		if (!data) throw new Error("Cannot set data without having data... smh")
		this._rawData = data
	}
	// private setField(key: keyof APIUser, value: unknown) {
	// 	if (!this._rawData) throw new Error("Cannot set field without having data... smh")
	// 	Reflect.set(this._rawData, key, value)
	// }

	/**
	 * The ID of the user
	 */
	readonly id: string

	/**
	 * Whether the user is a partial user (meaning it does not have all the data).
	 * If this is true, you should use {@link User.fetch} to get the full data of the user.
	 */
	get partial(): IsPartial {
		return (this._rawData === null) as never
	}

	/**
	 * The username of the user.
	 */
	get username(): IfPartial<IsPartial, string> {
		if (!this._rawData) return undefined as never
		return this._rawData.username
	}

	/**
	 * The global name of the user.
	 */
	get globalName(): IfPartial<IsPartial, string | null> {
		if (!this._rawData) return undefined as never
		return this._rawData.global_name
	}

	/**
	 * The discriminator of the user.
	 */
	get discriminator(): IfPartial<IsPartial, string> {
		if (!this._rawData) return undefined as never
		return this._rawData.discriminator
	}

	/**
	 * Is this user a bot?
	 */
	get bot(): IfPartial<IsPartial, boolean> {
		if (!this._rawData) return undefined as never
		return this._rawData.bot ?? false
	}

	/**
	 * Is this user a system user?
	 */
	get system(): IfPartial<IsPartial, boolean> {
		if (!this._rawData) return undefined as never
		return this._rawData.system ?? false
	}

	/**
	 * The public flags of the user. (Bitfield)
	 * @see https://discord.com/developers/docs/resources/user#user-object-user-flags
	 */
	get flags(): IfPartial<IsPartial, UserFlags | undefined> {
		if (!this._rawData) return undefined as never
		return this._rawData.public_flags
	}

	/**
	 * The avatar hash of the user.
	 * You can use {@link User.avatarUrl} to get the URL of the avatar.
	 */

	get avatar(): IfPartial<IsPartial, string | null> {
		if (!this._rawData) return undefined as never
		return this._rawData.avatar
	}

	/**
	 * Get the URL of the user's avatar
	 */
	get avatarUrl(): IfPartial<IsPartial, string | null> {
		if (!this._rawData) return undefined as never
		if (!this.avatar) return null
		return `https://cdn.discordapp.com/avatars/${this.id}/${this.avatar}.png`
	}

	/**
	 * The banner hash of the user.
	 * You can use {@link User.bannerUrl} to get the URL of the banner.
	 */
	get banner(): IfPartial<IsPartial, string | null> {
		if (!this._rawData) return undefined as never
		return this._rawData.banner ?? null
	}

	/**
	 * Get the URL of the user's banner
	 */
	get bannerUrl(): IfPartial<IsPartial, string | null> {
		if (!this._rawData) return undefined as never
		if (!this.banner) return null
		return `https://cdn.discordapp.com/banners/${this.id}/${this.banner}.png`
	}

	/**
	 * The accent color of the user.
	 */
	get accentColor(): IfPartial<IsPartial, number | null> {
		if (!this._rawData) return undefined as never
		return this._rawData.accent_color ?? null
	}

	/**
	 * Returns the Discord mention format for this user
	 * @returns The mention string in the format <@userId>
	 */
	toString(): string {
		return `<@${this.id}>`
	}

	/**
	 * Fetch updated data for this user.
	 * If the user is partial, this will fetch all the data for the user and populate the fields.
	 * If the user is not partial, all fields will be updated with new values from Discord.
	 * @param bypassCache Whether to bypass the cache and fetch fresh data
	 * @returns A Promise that resolves to a non-partial User
	 */
	async fetch(bypassCache = false): Promise<User<false>> {
		// Check cache if client has caching enabled
		if (!bypassCache && this.client.isCaching()) {
			const cachedUser = await this.client.cache.get("user", this.id)
			if (cachedUser) {
				this.setData(cachedUser.rawData)
				return this as User<false>
			}
		}

		const newData = (await this.client.rest.get(
			Routes.user(this.id)
		)) as APIUser
		if (!newData) throw new Error(`User ${this.id} not found`)

		this.setData(newData)

		// Update cache if client has caching enabled
		if (this.client.isCaching()) {
			await this.client.cache.set("user", this.id, this as User<false>)
		}

		return this as User<false>
	}

	/**
	 * Instantiate a new DM channel with this user.
	 */
	async createDm(userId: string) {
		const dmChannel = (await this.client.rest.post(Routes.userChannels(), {
			body: {
				recipient_id: userId
			}
		})) as APIDMChannel
		return dmChannel
	}

	/**
	 * Send a message to this user.
	 */
	async send(data: MessagePayload) {
		const dmChannel = await this.createDm(this.id)
		const message = (await this.client.rest.post(
			Routes.channelMessages(dmChannel.id),
			{
				body: serializePayload(data)
			}
		)) as APIMessage
		return new Message(this.client, message)
	}
}
