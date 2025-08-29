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
			this._rawData = rawDataOrId as never
			this.id = rawDataOrId.id
			this.setData(rawDataOrId as never)
		}
	}

	/**
	 * The raw data of the channel.
	 */
	protected _rawData: Extract<APIChannel, { type: Type }> | null = null
	protected setData(data: Extract<APIChannel, { type: Type }>) {
		if (!data) throw new Error("Cannot set data without having data... smh")
		this._rawData = data
	}
	protected setField(
		field: keyof Extract<APIChannel, { type: Type }>,
		value: unknown
	) {
		if (!this._rawData)
			throw new Error("Cannot set field without having data... smh")
		this._rawData[field] = value
	}

	/**
	 * The raw Discord API data for this channel
	 */
	get rawData(): Readonly<Extract<APIChannel, { type: Type }>> {
		if (!this._rawData)
			throw new Error(
				"Cannot access rawData on partial Channel. Use fetch() to populate data."
			)
		return this._rawData
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
		return (this._rawData === null) as never
	}

	/**
	 * The type of the channel.
	 */
	get type(): IfPartial<IsPartial, Type> {
		if (!this._rawData) return undefined as never
		return this._rawData.type
	}

	/**
	 * The flags of the channel in a bitfield.
	 * @see https://discord.com/developers/docs/resources/channel#channel-object-channel-flags
	 */
	get flags(): IfPartial<IsPartial, ChannelFlags | undefined> {
		if (!this._rawData) return undefined as never
		return this._rawData.flags
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

	/**
	 * Delete the channel
	 */
	async delete() {
		await this.client.rest.delete(Routes.channel(this.id))
	}

	/**
	 * Returns the Discord mention format for this channel
	 * @returns The mention string in the format <#channelId>
	 */
	toString(): string {
		return `<#${this.id}>`
	}
}
