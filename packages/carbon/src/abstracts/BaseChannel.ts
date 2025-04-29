import {
	type APIChannel,
	type ChannelFlags,
	type ChannelType,
	Routes
} from "discord-api-types/v10"
import type { Client } from "../classes/Client.js"
import type { IfPartial } from "../types/index.js"
import { Base } from "./Base.js"

export abstract class BaseChannel<
	Type extends ChannelType,
	IsPartial extends boolean = false
> extends Base {
	constructor(
		client: Client,
		rawDataOrId: IsPartial extends true
			? string
			: Extract<APIChannel, { type: Type }>
	) {
		super(client)
		if (typeof rawDataOrId === "string") {
			this.id = rawDataOrId
		} else {
			this.rawData = rawDataOrId as never
			this.id = rawDataOrId.id
			this.setData(rawDataOrId as never)
		}
	}

	/**
	 * The raw data of the channel.
	 */
	protected rawData: Extract<APIChannel, { type: Type }> | null = null
	protected setData(data: Extract<APIChannel, { type: Type }>) {
		if (!data) throw new Error("Cannot set data without having data... smh")
		this.rawData = data
	}
	protected setField(
		field: keyof Extract<APIChannel, { type: Type }>,
		value: unknown
	) {
		if (!this.rawData)
			throw new Error("Cannot set field without having data... smh")
		this.rawData[field] = value
	}

	/**
	 * The id of the channel.
	 */
	readonly id: string

	/**
	 * Whether the channel is a partial channel (meaning it does not have all the data).
	 * If this is true, you should use {@link BaseChannel.fetch} to get the full data of the channel.
	 */
	get partial(): IsPartial {
		return (this.rawData === null) as never
	}

	/**
	 * The type of the channel.
	 */
	get type(): IfPartial<IsPartial, Type> {
		if (!this.rawData) return undefined as never
		return this.rawData.type
	}

	/**
	 * The flags of the channel in a bitfield.
	 * @see https://discord.com/developers/docs/resources/channel#channel-object-channel-flags
	 */
	get flags(): IfPartial<IsPartial, ChannelFlags | undefined> {
		if (!this.rawData) return undefined as never
		return this.rawData.flags
	}

	/**
	 * Fetches the channel from the API.
	 * @returns A Promise that resolves to a non-partial channel
	 */
	async fetch(): Promise<BaseChannel<Type, false>> {
		const newData = (await this.client.rest.get(
			Routes.channel(this.id)
		)) as Extract<APIChannel, { type: Type }>
		if (!newData) throw new Error(`Channel ${this.id} not found`)

		this.setData(newData)
		return this as BaseChannel<Type, false>
	}
}
