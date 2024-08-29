import { type APIMessage, Routes } from "discord-api-types/v10"
import { Base } from "../abstracts/Base.js"
import type { Client } from "../classes/Client.js"
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
		if (this.rawData?.author.id)
			return new User(this.client, this.rawData.author.id)
		return null
	}
}
