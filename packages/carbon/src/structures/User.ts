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
import { Message } from "./Message.js"

export class User extends Base {
	/**
	 * The ID of the user
	 */
	id: string
	/**
	 * The username of the user.
	 */
	username?: string
	/**
	 * The global name of the user.
	 */
	globalName?: string | null
	/**
	 * The discriminator of the user.
	 */
	discriminator?: string
	/**
	 * The avatar hash of the user.
	 * You can use {@link user.avatarUrl} to get the URL of the avatar.
	 */
	avatar?: string | null
	/**
	 * Is this user a bot?
	 */
	bot?: boolean
	/**
	 * Is this user a system user?
	 */
	system?: boolean
	/**
	 * The public flags of the user. (Bitfield)
	 * @see https://discord.com/developers/docs/resources/user#user-object-user-flags
	 */
	flags?: UserFlags
	/**
	 * The banner hash of the user.
	 * You can use {@link user.bannerUrl} to get the URL of the banner.
	 */
	banner?: string | null
	/**
	 * The accent color of the user.
	 */
	accentColor?: number | null

	/**
	 * Whether the user is a partial user (meaning it does not have all the data).
	 * If this is true, you should use {@link user.fetch} to get the full data of the user.
	 */
	partial: boolean

	private rawData: APIUser | null = null

	constructor(client: Client, rawDataOrId: APIUser | string) {
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
		this.username = data.username
		this.globalName = data.global_name
		this.discriminator = data.discriminator
		this.avatar = data.avatar
		this.bot = data.bot
		this.system = data.system
		this.flags = data.public_flags
		this.banner = data.banner
		this.accentColor = data.accent_color
		this.partial = false
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

	/**
	 * Get the URL of the user's avatar
	 */
	get avatarUrl(): string | null {
		return this.avatar
			? `https://cdn.discordapp.com/avatars/${this.id}/${this.avatar}.png`
			: null
	}

	/**
	 * Get the URL of the user's banner
	 */
	get bannerUrl(): string | null {
		return this.banner
			? `https://cdn.discordapp.com/banners/${this.id}/${this.banner}.png`
			: null
	}
}
