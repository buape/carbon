import {
	type APIChannel,
	type APIMessage,
	type APIThreadChannel,
	type RESTPostAPIChannelThreadsJSONBody,
	Routes
} from "discord-api-types/v10"
import { Base } from "../abstracts/Base.js"
import type { Client } from "../classes/Client.js"
import { channelFactory } from "../factories/channelFactory.js"
import { GuildThreadChannel } from "./GuildThreadChannel.js"
import { User } from "./User.js"

export class Message extends Base {
	/**
	 * The ID of the message
	 */
	id: string
	/**
	 * The ID of the channel the message is in
	 */
	channelId: string
	/**
	 * Whether the message is a partial message (meaning it does not have all the data).
	 * If this is true, you should use {@link Message.fetch} to get the full data of the message.
	 */
	partial: boolean

	private rawData: APIMessage | null = null

	constructor(
		client: Client,
		rawDataOrIds:
			| APIMessage
			| {
					id: string
					channel_id: string
			  }
	) {
		super(client)
		this.id = rawDataOrIds.id
		this.channelId = rawDataOrIds.channel_id
		if (Object.keys(rawDataOrIds).length === 2) {
			this.partial = true
		} else {
			this.partial = false
			this.setData(rawDataOrIds as APIMessage)
		}
	}

	private setData(data: typeof this.rawData) {
		this.rawData = data
		if (!data) throw new Error("Cannot set data without having data... smh")
	}

	/**
	 * Fetch updated data for this message.
	 * If the message is partial, this will fetch all the data for the message and populate the fields.
	 * If the message is not partial, all fields will be updated with new values from Discord.
	 */
	async fetch() {
		const newData = (await this.client.rest.get(
			Routes.channelMessage(this.channelId, this.id)
		)) as APIMessage
		if (!newData) throw new Error(`Message ${this.id} not found`)

		this.setData(newData)
	}

	/**
	 * Delete this message from Discord
	 */
	async delete() {
		return await this.client.rest.delete(
			Routes.channelMessage(this.channelId, this.id)
		)
	}

	get author(): User | null {
		if (this.rawData?.webhook_id) return null // TODO: Add webhook user
		// Check if we have an additional property on the author object, in which case we have a full user object
		if (this.rawData?.author.username)
			return new User(this.client, this.rawData.author)
		// This means we only have a partial user object
		if (this.rawData?.author.id)
			return new User(this.client, this.rawData.author.id)
		return null
	}

	async fetchChannel() {
		const data = (await this.client.rest.get(
			Routes.channel(this.channelId)
		)) as APIChannel
		return channelFactory(this.client, data)
	}

	/**
	 * Pin this message
	 */
	async pin() {
		await this.client.rest.put(Routes.channelPin(this.channelId, this.id))
	}

	/**
	 * Unpin this message
	 */
	async unpin() {
		await this.client.rest.delete(Routes.channelPin(this.channelId, this.id))
	}

	/**
	 * Start a thread with this message as the associated start message.
	 * If you want to start a thread without a start message, use {@link BaseGuildTextChannel.startThread}
	 */
	async startThread(data: RESTPostAPIChannelThreadsJSONBody) {
		const thread = (await this.client.rest.post(
			Routes.threads(this.channelId, this.id),
			{
				body: { ...data }
			}
		)) as APIThreadChannel
		return new GuildThreadChannel(this.client, thread)
	}
}
