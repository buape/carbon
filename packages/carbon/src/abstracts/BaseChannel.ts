import {
	type APIChannel,
	type ChannelType,
	Routes
} from "discord-api-types/v10"
import type { Client } from "../classes/Client.js"
import { Base } from "./Base.js"

export abstract class BaseChannel<Type extends ChannelType> extends Base {
	/**
	 * The id of the channel.
	 */
	id: string
	/**
	 * Whether the channel is a partial channel (meaning it does not have all the data).
	 * If this is true, you should use {@link BaseChannel.fetch} to get the full data of the channel.
	 */
	partial: boolean
	/**
	 * The type of the channel.
	 */
	type?: Type
	/**
	 * The flags of the channel in a bitfield.
	 * @see https://discord.com/developers/docs/resources/channel#channel-object-channel-flags
	 */
	flags?: number | null
	/**
	 * The raw data of the channel.
	 */
	protected rawData: Extract<APIChannel, { type: Type }> | null = null

	constructor(
		client: Client,
		rawDataOrId: Extract<APIChannel, { type: Type }> | string
	) {
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

	protected setData(data: Extract<APIChannel, { type: Type }>) {
		if (!data) throw new Error("Cannot set data without having data... smh")
		this.rawData = data
		this.type = data.type
		this.partial = false
		this.setSpecificData(data)
	}

	protected abstract setSpecificData(
		data: Extract<APIChannel, { type: Type }>
	): void

	/**
	 * Fetches the channel from the API.
	 * @returns The channel data.
	 */
	async fetch() {
		const newData = (await this.client.rest.get(
			Routes.channel(this.id)
		)) as Extract<APIChannel, { type: Type }>
		if (!newData) throw new Error(`Channel ${this.id} not found`)

		this.setData(newData)
	}
}
