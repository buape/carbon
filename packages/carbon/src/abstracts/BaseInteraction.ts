import {
	type APIChannel,
	type APIInteraction,
	InteractionResponseType,
	type InteractionType,
	type RESTPatchAPIInteractionOriginalResponseJSONBody,
	type RESTPostAPIInteractionCallbackJSONBody,
	type RESTPostAPIInteractionFollowupJSONBody,
	Routes
} from "discord-api-types/v10"
import {
	Base,
	type Client,
	Embed,
	Guild,
	Message,
	type Modal,
	type Row,
	User,
	channelFactory
} from "../index.js"
import { GuildMember } from "../structures/GuildMember.js"

/**
 * The data to reply to an interaction
 */
export type InteractionReplyData = {
	/**
	 * The content of the message
	 */
	content?: string
	/**
	 * The embeds of the message
	 */
	embeds?: Embed[]
	/**
	 * The components to send in the message, listed in rows
	 */
	components?: Row[]
}

/**
 * Additional options for replying to an interaction
 */
export type InteractionReplyOptions = {
	/**
	 * The files to send in the interaction
	 */
	files?: InteractionFileData[]
	/**
	 * Whether the interaction should be ephemeral
	 */
	ephemeral?: boolean
}

/**
 * The data for a file to send in an interaction
 */
export type InteractionFileData = {
	/**
	 * The name of the file that will be given to Discord
	 */
	name: string
	/**
	 * The data of the file in a Blob
	 */
	data: Blob
	/**
	 * The alt text of the file, shown for accessibility
	 * @alpha This isn't implemented yet
	 */
	description?: string
}

export type InteractionDefaults = {
	ephemeral?: boolean
}

/**
 * This is the base type interaction, all interaction types extend from this
 */
export abstract class BaseInteraction<T extends APIInteraction> extends Base {
	/**
	 * The type of interaction
	 */
	type: InteractionType
	/**
	 * The raw data of the interaction
	 */
	rawData: T
	/**
	 * The user who sent the interaction
	 */
	userId: string | undefined

	/**
	 * Whether the interaction is deferred already
	 * @internal
	 */
	_deferred = false

	private defaultEphemeral = false

	constructor(client: Client, data: T, defaults: InteractionDefaults) {
		super(client)
		this.rawData = data
		this.type = data.type
		this.userId =
			this.rawData.user?.id || this.rawData.member?.user.id || undefined
		if (defaults.ephemeral) this.defaultEphemeral = defaults.ephemeral
	}

	get embeds(): Embed[] | null {
		if (!this.rawData.message) return null
		return this.rawData.message.embeds.map((embed) => new Embed(embed))
	}

	get message(): Message | null {
		if (!this.rawData.message) return null
		return new Message(this.client, this.rawData.message)
	}

	get guild(): Guild | null {
		if (!this.rawData.guild_id) return null
		return new Guild(this.client, this.rawData.guild_id)
	}

	get user(): User | null {
		if (this.rawData.user) return new User(this.client, this.rawData.user)
		if (this.rawData.member)
			return new User(this.client, this.rawData.member.user)
		return null
	}

	get channel() {
		if (!this.rawData.channel) return null
		return channelFactory(this.client, this.rawData.channel as APIChannel)
	}

	get member() {
		if (!this.rawData.member) return null
		if (!this.guild) return null
		return new GuildMember(this.client, this.rawData.member, this.guild)
	}

	/**
	 * Reply to an interaction.
	 * If the interaction is deferred, this will edit the original response.
	 * @param data The response data
	 */
	async reply(
		data: InteractionReplyData,
		options: InteractionReplyOptions = {}
	) {
		if (this._deferred) {
			await this.client.rest.patch(
				Routes.webhookMessage(
					this.client.options.clientId,
					this.rawData.token,
					"@original"
				),
				{
					body: {
						...data,
						embeds: data.embeds?.map((embed) => embed.serialize()),
						components: data.components?.map((row) => row.serialize()),
						flags: options.ephemeral ? 64 : undefined
					} as RESTPatchAPIInteractionOriginalResponseJSONBody,
					files: options.files
				}
			)
		} else {
			await this.client.rest.post(
				Routes.interactionCallback(this.rawData.id, this.rawData.token),
				{
					body: {
						type: InteractionResponseType.ChannelMessageWithSource,
						data: {
							...data,
							embeds: data.embeds?.map((embed) => embed.serialize()),
							components: data.components?.map((row) => row.serialize()),
							flags: options.ephemeral ? 64 : undefined
						}
					} as RESTPostAPIInteractionCallbackJSONBody,
					files: options.files
				}
			)
		}
	}

	/**
	 * Defer the interaction response. This is used automatically by commands that are set to defer.
	 * If the interaction is already deferred, this will do nothing.
	 * @internal
	 */
	async defer() {
		if (this._deferred) return
		this._deferred = true
		await this.client.rest.post(
			Routes.interactionCallback(this.rawData.id, this.rawData.token),
			{
				body: {
					type: InteractionResponseType.DeferredChannelMessageWithSource,
					flags: this.defaultEphemeral ? 64 : undefined
				} as RESTPostAPIInteractionCallbackJSONBody
			}
		)
	}

	/**
	 * Show a modal to the user
	 * This can only be used if the interaction is not deferred
	 */
	async showModal(modal: Modal) {
		if (this._deferred)
			throw new Error("You cannot defer an interaction that shows a modal")
		await this.client.rest.post(
			Routes.interactionCallback(this.rawData.id, this.rawData.token),
			{
				body: {
					type: InteractionResponseType.Modal,
					data: modal.serialize()
				} as RESTPostAPIInteractionCallbackJSONBody
			}
		)
	}

	/**
	 * Send a followup message to the interaction
	 */
	async followUp(
		reply: InteractionReplyData,
		options: InteractionReplyOptions = {}
	) {
		await this.client.rest.post(
			Routes.webhook(this.client.options.clientId, this.rawData.token),
			{
				body: {
					...reply,
					embeds: reply.embeds?.map((embed) => embed.serialize()),
					components: reply.components?.map((row) => row.serialize()),
					flags: options.ephemeral ? 64 : undefined
				} as RESTPostAPIInteractionFollowupJSONBody
			}
		)
	}
}
