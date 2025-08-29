import {
	type APIAttachment,
	type APIChannel,
	type APIComponentInContainer,
	type APIMessage,
	type APIMessageInteractionMetadata,
	type APIMessageReference,
	type APIReaction,
	type APIStickerItem,
	type APIThreadChannel,
	type ChannelType,
	ComponentType,
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
import type { IfPartial, MessagePayload } from "../types/index.js"
import { serializePayload } from "../utils/index.js"
import { GuildThreadChannel } from "./GuildThreadChannel.js"
import { Poll } from "./Poll.js"
import { Role } from "./Role.js"
import { User } from "./User.js"

export class Message<IsPartial extends boolean = false> extends Base {
	constructor(
		client: Client,
		rawDataOrIds: IsPartial extends true
			? { id: string; channelId?: string }
			: APIMessage
	) {
		super(client)
		if (
			Object.keys(rawDataOrIds).length === 2 &&
			"id" in rawDataOrIds &&
			"channelId" in rawDataOrIds
		) {
			this.id = rawDataOrIds.id
			this.channelId = rawDataOrIds.channelId || ""
		} else {
			const data = rawDataOrIds as APIMessage
			this.id = data.id
			this.channelId = data.channel_id
			this.setData(data)
		}
	}

	protected rawData: APIMessage | null = null
	private setData(data: typeof this.rawData) {
		this.rawData = data
		if (!data) throw new Error("Cannot set data without having data... smh")
	}

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
	get poll(): IfPartial<IsPartial, Poll | undefined> {
		if (!this.rawData?.poll) return undefined as never
		return new Poll(this.client, {
			channelId: this.channelId,
			messageId: this.id,
			data: this.rawData.poll
		})
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
	 * @returns A Promise that resolves to a non-partial Message
	 */
	async fetch(): Promise<Message<false>> {
		if (!this.channelId)
			throw new Error("Cannot fetch message without channel ID")

		const newData = (await this.client.rest.get(
			Routes.channelMessage(this.channelId, this.id)
		)) as APIMessage
		if (!newData) throw new Error(`Message ${this.id} not found`)

		this.setData(newData)

		return this as Message<false>
	}

	/**
	 * Delete this message from Discord
	 */
	async delete() {
		if (!this.channelId)
			throw new Error("Cannot delete message without channel ID")
		await this.client.rest.delete(
			Routes.channelMessage(this.channelId, this.id)
		)
	}

	/**
	 * Get the channel the message was sent in
	 */
	async fetchChannel() {
		if (!this.channelId)
			throw new Error("Cannot fetch channel without channel ID")

		const data = (await this.client.rest.get(
			Routes.channel(this.channelId)
		)) as APIChannel
		const channel = channelFactory(this.client, data)

		return channel
	}

	/**
	 * Pin this message
	 */
	async pin() {
		if (!this.channelId)
			throw new Error("Cannot pin message without channel ID")
		await this.client.rest.put(
			Routes.channelMessagesPin(this.channelId, this.id)
		)
	}

	/**
	 * Unpin this message
	 */
	async unpin() {
		if (!this.channelId)
			throw new Error("Cannot unpin message without channel ID")
		await this.client.rest.delete(
			Routes.channelMessagesPin(this.channelId, this.id)
		)
	}

	/**
	 * Start a thread with this message as the associated start message.
	 * If you want to start a thread without a start message, use {@link BaseGuildTextChannel.startThread}
	 */
	async startThread(data: RESTPostAPIChannelThreadsJSONBody) {
		if (!this.channelId)
			throw new Error("Cannot start thread without channel ID")
		const thread = (await this.client.rest.post(
			Routes.threads(this.channelId, this.id),
			{
				body: { ...data }
			}
		)) as APIThreadChannel
		return new GuildThreadChannel(this.client, thread)
	}

	/**
	 * Edit this message
	 * @param data - The data to edit the message with
	 * @returns A Promise that resolves to the edited message
	 */
	async edit(data: MessagePayload): Promise<Message> {
		if (!this.channelId)
			throw new Error("Cannot edit message without channel ID")
		const serialized = serializePayload(data)
		const newMessage = (await this.client.rest.patch(
			Routes.channelMessage(this.channelId, this.id),
			{
				body: {
					...serialized
				} satisfies RESTPatchAPIChannelMessageJSONBody
			}
		)) as APIMessage
		this.setData(newMessage)
		return this as Message
	}

	/**
	 * Forward this message to a different channel
	 * @param channelId - The ID of the channel to forward the message to
	 * @returns A Promise that resolves to the forwarded message
	 */
	async forward(channelId: string): Promise<Message> {
		if (!this.channelId)
			throw new Error("Cannot forward message without channel ID")
		const channel = await this.client.fetchChannel(channelId)
		if (!channel) throw new Error(`Channel ${channelId} not found`)
		if (!("send" in channel))
			throw new Error(`Cannot forward message to channel ${channelId}`)
		const message = (await this.client.rest.post(
			Routes.channelMessages(channelId),
			{
				body: {
					message_reference: {
						type: MessageReferenceType.Forward,
						message_id: this.id,
						channel_id: this.channelId
					}
				} satisfies RESTPostAPIChannelMessageJSONBody
			}
		)) as APIMessage
		return new Message(this.client, message)
	}

	/**
	 * Reply to this message
	 * @param data - The data to reply with
	 * @returns A Promise that resolves to the replied message
	 */
	async reply(data: MessagePayload): Promise<Message> {
		if (!this.channelId)
			throw new Error("Cannot reply to message without channel ID")
		const serialized = serializePayload(data)
		const message = (await this.client.rest.post(
			Routes.channelMessages(this.channelId),
			{
				body: {
					...serialized,
					message_reference: {
						type: MessageReferenceType.Default,
						message_id: this.id
					}
				} satisfies RESTPostAPIChannelMessageJSONBody
			}
		)) as APIMessage
		return new Message(this.client, message)
	}

	/**
	 * Disable all buttons on the message except for link buttons
	 */
	async disableAllButtons() {
		if (!this.rawData) return
		if (!this.rawData.components) return
		const patched = (await this.client.rest.patch(
			Routes.channelMessage(this.channelId, this.id),
			{
				body: {
					...this.rawData,
					components:
						this.rawData.components?.map((component) => {
							const disable = (component: APIComponentInContainer) => {
								if (component.type === ComponentType.ActionRow) {
									return {
										...component,
										components: component.components.map((c) => ({
											...c,
											...("disabled" in c ? { disabled: true } : {})
										}))
									}
								}
								if (component.type === ComponentType.Section) {
									return {
										...component,
										accessory:
											"disabled" in component.accessory
												? { ...component.accessory, disabled: true }
												: component.accessory
									}
								}
								return component
							}
							if (component.type === ComponentType.Container) {
								return {
									...component,
									components: component.components.map((c) => disable(c))
								}
							}
							return disable(component)
						}) ?? []
				} satisfies RESTPatchAPIChannelMessageJSONBody
			}
		)) as APIMessage
		this.setData(patched)
	}
}
