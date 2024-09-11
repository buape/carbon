import {
	type APIAllowedMentions,
	type APIAttachment,
	type APIChannel,
	type APIMessage,
	type APIMessageInteractionMetadata,
	type APIMessageReference,
	type APIPoll,
	type APIReaction,
	type APISticker,
	type APIThreadChannel,
	type ChannelType,
	type MessageFlags,
	type MessageType,
	type RESTPostAPIChannelThreadsJSONBody,
	Routes
} from "discord-api-types/v10"
import { Base } from "../abstracts/Base.js"
import type { Client } from "../classes/Client.js"
import { channelFactory } from "../factories/channelFactory.js"
import { GuildThreadChannel } from "./GuildThreadChannel.js"
import { User } from "./User.js"
import { Embed } from "../classes/Embed.js"
import type { Row } from "../classes/Row.js"
import { Role } from "./Role.js"

export class Message extends Base {
	/**
	 * The ID of the message
	 */
	protected id: string
	/**
	 * The ID of the channel the message is in
	 */
	protected channelId: string
	/**
	 * Whether the message is a partial message (meaning it does not have all the data).
	 * If this is true, you should use {@link Message.fetch} to get the full data of the message.
	 */
	protected partial: boolean
	/**
	 * If this message is a response to an interaction, this is the ID of the interaction's application
	 */
	protected applicationId?: string
	/**
	 * The attachments of the message
	 */
	protected attachments?: APIAttachment[]
	/**
	 * The components of the message
	 */
	protected components?: APIMessage["components"]
	/**
	 * The content of the message
	 */
	protected content?: string
	/**
	 * If this message was edited, this is the timestamp of the edit
	 */
	protected editedTimestamp?: string | null
	/**
	 * The flags of the message
	 */
	protected flags?: MessageFlags
	/**
	 * The interaction metadata of the message
	 */
	protected interactionMetadata?: APIMessageInteractionMetadata
	/**
	 * Whether the message mentions everyone
	 */
	protected mentionedEveryone?: boolean
	/**
	 * The data about the referenced message. You can use {@link Message.referencedMessage} to get the referenced message itself.
	 */
	protected messageReference?: APIMessageReference
	/**
	 * Whether the message is pinned
	 */
	protected pinned?: boolean
	/**
	 * The poll contained in the message
	 */
	protected poll?: APIPoll
	/**
	 * The approximate position of the message in the channel
	 */
	protected position?: number
	/**
	 * The reactions on the message
	 */
	protected reactions?: APIReaction[]
	/**
	 * The stickers in the message
	 */
	protected stickers?: APISticker[]
	/**
	 * The timestamp of the original message
	 */
	protected timestamp?: string
	/**
	 * Whether the message is a TTS message
	 */
	protected tts?: boolean
	/**
	 * The type of the message
	 */
	protected type?: MessageType
	/**
	 * If a webhook is used to send the message, this is the ID of the webhook
	 */
	protected webhookId?: string

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
		this.applicationId = data.application_id
		this.attachments = data.attachments
		this.components = data.components
		this.content = data.content
		this.editedTimestamp = data.edited_timestamp
		this.flags = data.flags
		this.interactionMetadata = data.interaction_metadata
		this.mentionedEveryone = data.mention_everyone
		this.messageReference = data.message_reference
		this.pinned = data.pinned
		this.poll = data.poll
		this.position = data.position
		this.reactions = data.reactions
		this.stickers = data.stickers
		this.timestamp = data.timestamp
		this.tts = data.tts
		this.type = data.type
		this.webhookId = data.webhook_id
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
	 * Get the author of the message
	 */
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

	get thread(): GuildThreadChannel<
		ChannelType.PublicThread | ChannelType.AnnouncementThread
	> | null {
		if (!this.rawData?.thread) return null
		return channelFactory(
			this.client,
			this.rawData?.thread
		) as GuildThreadChannel<
			ChannelType.PublicThread | ChannelType.AnnouncementThread
		>
	}

	get embeds(): Embed[] {
		if (!this.rawData?.embeds) return []
		return this.rawData.embeds.map((embed) => new Embed(embed))
	}

	async edit(data: {
		content?: string
		embeds?: Embed[]
		allowedMentions?: APIAllowedMentions
		components?: Row[]
	}) {
		await this.client.rest.patch(
			Routes.channelMessage(this.channelId, this.id),
			{
				body: {
					...data,
					embeds: data.embeds?.map((embed) => embed.serialize()),
					components: data.components?.map((row) => row.serialize()),
					allowed_mentions: data.allowedMentions
				}
			}
		)
	}

	get mentionedUsers(): User[] {
		if (!this.rawData?.mentions) return []
		return this.rawData.mentions.map(
			(mention) => new User(this.client, mention)
		)
	}

	get mentionedRoles(): Role[] {
		if (!this.rawData?.mention_roles) return []
		return this.rawData.mention_roles.map(
			(mention) => new Role(this.client, mention)
		)
	}

	get referencedMessage(): Message | null {
		if (!this.rawData?.referenced_message) return null
		return new Message(this.client, this.rawData?.referenced_message)
	}
}
