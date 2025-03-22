import {
	type APIAttachment,
	type APIChannel,
	type APIMessage,
	type APIMessageInteractionMetadata,
	type APIMessageReference,
	type APIPoll,
	type APIReaction,
	type APIStickerItem,
	type APIThreadChannel,
	type ChannelType,
	type MessageFlags,
	MessageReferenceType,
	type MessageType,
	type RESTPatchAPIChannelMessageJSONBody,
	type RESTPostAPIChannelMessageJSONBody,
	type RESTPostAPIChannelThreadsJSONBody,
	Routes
} from "discord-api-types/v10"
import { Base } from "../abstracts/Base.js"
import type { Client } from "../classes/Client.js"
import { Embed } from "../classes/Embed.js"
import { channelFactory } from "../functions/channelFactory.js"
import type { MessagePayload } from "../types.js"
import { type IfPartial, serializePayload } from "../utils.js"
import { GuildThreadChannel } from "./GuildThreadChannel.js"
import { Role } from "./Role.js"
import { User } from "./User.js"

export class Message<IsPartial extends boolean = false> extends Base {
	constructor(
		client: Client,
		rawDataOrIds: IsPartial extends true
			? { id: string; channelId: string }
			: APIMessage
	) {
		super(client)
		if (Object.keys(rawDataOrIds).length === 2) {
			this.id = rawDataOrIds.id
			this.channelId = rawDataOrIds["channelId" as never]
		} else {
			const data = rawDataOrIds as APIMessage
			this.id = data.id
			this.channelId = data.channel_id
			this.setData(data)
		}
	}

	private rawData: APIMessage | null = null
	private setData(data: typeof this.rawData) {
		this.rawData = data
		if (!data) throw new Error("Cannot set data without having data... smh")
	}
	// private setField(key: keyof APIMessage, value: unknown) {
	// 	if (!this.rawData)
	// 		throw new Error("Cannot set field without having data... smh")
	// 	Reflect.set(this.rawData, key, value)
	// }

	/**
	 * The ID of the message
	 */
	readonly id: string

	/**
	 * The ID of the channel the message is in
	 */
	readonly channelId: string

	/**
	 * Whether the message is a partial message (meaning it does not have all the data).
	 * If this is true, you should use {@link Message.fetch} to get the full data of the message.
	 */
	get partial(): IsPartial {
		return (this.rawData === null) as never
	}

	/**
	 * If this message is a response to an interaction, this is the ID of the interaction's application
	 */
	get applicationId(): IfPartial<IsPartial, string | undefined> {
		if (!this.rawData) return undefined as never
		return this.rawData.application_id
	}

	/**
	 * The attachments of the message
	 */
	get attachments(): IfPartial<IsPartial, APIAttachment[]> {
		if (!this.rawData) return undefined as never
		return this.rawData.attachments ?? []
	}

	/**
	 * The components of the message
	 */
	get components(): IfPartial<
		IsPartial,
		NonNullable<APIMessage["components"]>
	> {
		if (!this.rawData) return undefined as never
		return this.rawData.components ?? []
	}

	/**
	 * The content of the message
	 */
	get content(): IfPartial<IsPartial, string> {
		if (!this.rawData) return undefined as never
		return this.rawData.content ?? ""
	}

	get embeds(): IfPartial<IsPartial, Embed[]> {
		if (!this.rawData) return undefined as never
		if (!this.rawData?.embeds) return []
		return this.rawData.embeds.map((embed) => new Embed(embed))
	}

	/**
	 * If this message was edited, this is the timestamp of the edit
	 */
	get editedTimestamp(): IfPartial<IsPartial, string | null> {
		if (!this.rawData) return undefined as never
		return this.rawData.edited_timestamp as never
	}

	/**
	 * The flags of the message
	 */
	get flags(): IfPartial<IsPartial, MessageFlags> {
		if (!this.rawData) return undefined as never
		return this.rawData.flags as never
	}

	/**
	 * The interaction metadata of the message
	 */
	get interactionMetadata(): IfPartial<
		IsPartial,
		APIMessageInteractionMetadata | undefined
	> {
		if (!this.rawData) return undefined as never
		return this.rawData.interaction_metadata
	}

	/**
	 * Whether the message mentions everyone
	 */
	get mentionedEveryone(): IfPartial<IsPartial, boolean> {
		if (!this.rawData) return undefined as never
		return this.rawData.mention_everyone
	}

	/**
	 * The users mentioned in the message
	 */
	get mentionedUsers(): IfPartial<IsPartial, User[]> {
		if (!this.rawData) return undefined as never
		if (!this.rawData?.mentions) return []
		return this.rawData.mentions.map(
			(mention) => new User(this.client, mention)
		)
	}

	/**
	 * The roles mentioned in the message
	 */
	get mentionedRoles(): IfPartial<IsPartial, Role<true>[]> {
		if (!this.rawData) return undefined as never
		if (!this.rawData?.mention_roles) return []
		return this.rawData.mention_roles.map(
			(mention) => new Role<true>(this.client, mention)
		)
	}

	/**
	 * The data about the referenced message. You can use {@link Message.referencedMessage} to get the referenced message itself.
	 */
	get messageReference(): IfPartial<
		IsPartial,
		APIMessageReference | undefined
	> {
		if (!this.rawData) return undefined as never
		return this.rawData.message_reference
	}

	/**
	 * The referenced message itself
	 */
	get referencedMessage(): IfPartial<IsPartial, Message | null> {
		if (!this.rawData?.referenced_message) return null as never
		return new Message(this.client, this.rawData?.referenced_message)
	}

	/**
	 * Whether the message is pinned
	 */
	get pinned(): IfPartial<IsPartial, boolean> {
		if (!this.rawData) return undefined as never
		return this.rawData.pinned
	}

	/**
	 * The poll contained in the message
	 */
	get poll(): IfPartial<IsPartial, APIPoll | undefined> {
		if (!this.rawData) return undefined as never
		return this.rawData.poll
	}

	/**
	 * The approximate position of the message in the channel
	 */
	get position(): IfPartial<IsPartial, number | undefined> {
		if (!this.rawData) return undefined as never
		return this.rawData.position
	}

	/**
	 * The reactions on the message
	 */
	get reactions(): IfPartial<IsPartial, APIReaction[]> {
		if (!this.rawData) return undefined as never
		return this.rawData.reactions ?? []
	}

	/**
	 * The stickers in the message
	 */
	get stickers(): IfPartial<IsPartial, APIStickerItem[]> {
		if (!this.rawData) return undefined as never
		return this.rawData.sticker_items ?? []
	}

	/**
	 * The timestamp of the original message
	 */
	get timestamp(): IfPartial<IsPartial, string> {
		if (!this.rawData) return undefined as never
		return this.rawData.timestamp
	}

	/**
	 * Whether the message is a TTS message
	 */
	get tts(): IfPartial<IsPartial, boolean> {
		if (!this.rawData) return undefined as never
		return this.rawData.tts
	}

	/**
	 * The type of the message
	 */
	get type(): IfPartial<IsPartial, MessageType> {
		if (!this.rawData) return undefined as never
		return this.rawData.type
	}

	/**
	 * Get the author of the message
	 */
	get author(): IfPartial<IsPartial, User | null> {
		if (!this.rawData) return null as never
		if (this.rawData?.webhook_id) return null as never // TODO: Add webhook user
		return new User(this.client, this.rawData.author)
	}

	/**
	 * Get the thread associated with this message, if there is one
	 */
	get thread(): IfPartial<
		IsPartial,
		GuildThreadChannel<
			ChannelType.PublicThread | ChannelType.AnnouncementThread
		> | null
	> {
		if (!this.rawData) return null as never
		if (!this.rawData?.thread) return null
		return channelFactory(
			this.client,
			this.rawData?.thread
		) as GuildThreadChannel<
			ChannelType.PublicThread | ChannelType.AnnouncementThread
		>
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

	/**
	 * Get the channel the message was sent in
	 */
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

	async edit(data: MessagePayload) {
		const serialized = serializePayload(data)
		await this.client.rest.patch(
			Routes.channelMessage(this.channelId, this.id),
			{
				body: {
					...serialized
				} satisfies RESTPatchAPIChannelMessageJSONBody
			}
		)
	}

	async forward(channelId: string) {
		const channel = await this.client.fetchChannel(channelId)
		if (!channel) throw new Error(`Channel ${channelId} not found`)
		if (!("send" in channel))
			throw new Error(`Cannot forward message to channel ${channelId}`)
		await this.client.rest.post(Routes.channelMessages(channelId), {
			body: {
				message_reference: {
					type: MessageReferenceType.Forward,
					message_id: this.id,
					channel_id: this.channelId
				}
			} satisfies RESTPostAPIChannelMessageJSONBody
		})
	}

	async reply(data: MessagePayload) {
		const serialized = serializePayload(data)
		await this.client.rest.post(Routes.channelMessages(this.channelId), {
			body: {
				...serialized,
				message_reference: {
					type: MessageReferenceType.Default,
					message_id: this.id
				}
			} satisfies RESTPostAPIChannelMessageJSONBody
		})
	}
}
