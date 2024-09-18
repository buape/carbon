import {
	type APIDMChannel,
	type APIMessage,
	type APIUser,
	type RESTPostAPIChannelMessageJSONBody,
	Routes,
	type UserFlags
} from "discord-api-types/v10"
import { Base } from "../abstracts/Base.js"
import type { Client } from "../classes/Client.js"
import type { IfPartial } from "../utils.js"
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
			this.rawData = rawDataOrId
			this.id = rawDataOrId.id
			this.setData(rawDataOrId)
		}
	}

	private rawData: APIUser | null = null
	private setData(data: typeof this.rawData) {
		if (!data) throw new Error("Cannot set data without having data... smh")
		this.rawData = data
	}
	// private setField(key: keyof APIUser, value: unknown) {
	// 	if (!this.rawData) throw new Error("Cannot set field without having data... smh")
	// 	Reflect.set(this.rawData, key, value)
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
		return (this.rawData === null) as never
	}

	/**
	 * The username of the user.
	 */
	get username(): IfPartial<IsPartial, string> {
		if (!this.rawData) return undefined as never
		return this.rawData.username
	}

	/**
	 * The global name of the user.
	 */
	get globalName(): IfPartial<IsPartial, string | null> {
		if (!this.rawData) return undefined as never
		return this.rawData.global_name
	}

	/**
	 * The discriminator of the user.
	 */
	get discriminator(): IfPartial<IsPartial, string> {
		if (!this.rawData) return undefined as never
		return this.rawData.discriminator
	}

	/**
	 * Is this user a bot?
	 */
	get bot(): IfPartial<IsPartial, boolean> {
		if (!this.rawData) return undefined as never
		return this.rawData.bot ?? false
	}

	/**
	 * Is this user a system user?
	 */
	get system(): IfPartial<IsPartial, boolean> {
		if (!this.rawData) return undefined as never
		return this.rawData.system ?? false
	}

	/**
	 * The public flags of the user. (Bitfield)
	 * @see https://discord.com/developers/docs/resources/user#user-object-user-flags
	 */
	get flags(): IfPartial<IsPartial, UserFlags | undefined> {
		if (!this.rawData) return undefined as never
		return this.rawData.public_flags
	}

	/**
	 * The avatar hash of the user.
	 * You can use {@link User.avatarUrl} to get the URL of the avatar.
	 */

	get avatar(): IfPartial<IsPartial, string | null> {
		if (!this.rawData) return undefined as never
		return this.rawData.avatar
	}

	/**
	 * Get the URL of the user's avatar
	 */
	get avatarUrl(): IfPartial<IsPartial, string | null> {
		if (!this.rawData) return undefined as never
		if (!this.avatar) return null
		return `https://cdn.discordapp.com/avatars/${this.id}/${this.avatar}.png`
	}

	/**
	 * The banner hash of the user.
	 * You can use {@link User.bannerUrl} to get the URL of the banner.
	 */
	get banner(): IfPartial<IsPartial, string | null> {
		if (!this.rawData) return undefined as never
		return this.rawData.banner ?? null
	}

	/**
	 * Get the URL of the user's banner
	 */
	get bannerUrl(): IfPartial<IsPartial, string | null> {
		if (!this.rawData) return undefined as never
		if (!this.banner) return null
		return `https://cdn.discordapp.com/banners/${this.id}/${this.banner}.png`
	}

	/**
	 * The accent color of the user.
	 */
	get accentColor(): IfPartial<IsPartial, number | null> {
		if (!this.rawData) return undefined as never
		return this.rawData.accent_color ?? null
	}

	/**
	 * Fetch updated data for this user.
	 * If the user is partial, this will fetch all the data for the user and populate the fields.
	 * If the user is not partial, all fields will be updated with new values from Discord.
	 */
	async fetch() {
		const newData = (await this.client.rest.get(
			Routes.user(this.id)
		)) as APIUser
		if (!newData) throw new Error(`User ${this.id} not found`)

		this.setData(newData)
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
	async send(data: RESTPostAPIChannelMessageJSONBody) {
		const dmChannel = await this.createDm(this.id)
		const message = (await this.client.rest.post(
			Routes.channelMessages(dmChannel.id),
			{
				body: {
					...data
				}
			}
		)) as APIMessage
		return new Message(this.client, message)
	}
}
