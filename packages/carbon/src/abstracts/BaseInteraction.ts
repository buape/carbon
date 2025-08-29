import {
	type APIChannel,
	type APIInteraction,
	type APIMessageComponentInteractionData,
	InteractionResponseType,
	type InteractionType,
	MessageFlags,
	type RESTPatchAPIWebhookWithTokenMessageResult,
	type RESTPostAPIInteractionCallbackJSONBody,
	type RESTPostAPIInteractionCallbackWithResponseResult,
	type RESTPostAPIInteractionFollowupJSONBody,
	Routes
} from "discord-api-types/v10"
import {
	BaseMessageInteractiveComponent,
	type Client,
	Container,
	Embed,
	Guild,
	Message,
	type Modal,
	Row,
	Section,
	User,
	channelFactory
} from "../index.js"
import { GuildMember } from "../structures/GuildMember.js"
import type { MessagePayload, TopLevelComponents } from "../types/index.js"
import { serializePayload } from "../utils/index.js"
import { Base } from "./Base.js"

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
	 * The internal raw data of the interaction
	 */
	protected _rawData: T

	/**
	 * The raw Discord API data for this interaction
	 */
	get rawData(): Readonly<T> {
		return this._rawData
	}
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
		this._rawData = data
		this.type = data.type
		this.userId =
			this._rawData.user?.id || this._rawData.member?.user.id || undefined
		if (defaults.ephemeral) this.defaultEphemeral = defaults.ephemeral
	}

	get embeds(): Embed[] | null {
		if (!this._rawData.message) return null
		return this._rawData.message.embeds.map((embed) => new Embed(embed))
	}

	get message(): Message | null {
		if (!this._rawData.message) return null
		return new Message(this.client, this._rawData.message)
	}

	get guild(): Guild<true> | null {
		if (!this._rawData.guild_id) return null
		return new Guild<true>(this.client, this._rawData.guild_id)
	}

	get user(): User | null {
		if (this._rawData.user) return new User(this.client, this._rawData.user)
		if (this._rawData.member)
			return new User(this.client, this._rawData.member.user)
		return null
	}

	get channel() {
		if (!this._rawData.channel) return null
		return channelFactory(this.client, this._rawData.channel as APIChannel)
	}

	get member() {
		if (!this._rawData.member) return null
		if (!this.guild) return null
		return new GuildMember(this.client, this._rawData.member, this.guild)
	}

	/**
	 * @internal
	 * Automatically register components found in a message payload when sending the message.
	 */
	protected _internalAutoRegisterComponentsOnSend(data: MessagePayload) {
		if (typeof data !== "string" && data.components) {
			this._internalRegisterComponentsOnSend(data.components)
		}
	}

	/**
	 * @internal
	 * Register components found in a message payload when sending the message.
	 */
	private _internalRegisterComponentsOnSend(components: TopLevelComponents[]) {
		for (const component of components) {
			if (component instanceof Row) {
				for (const childComponent of component.components) {
					if (childComponent instanceof BaseMessageInteractiveComponent) {
						const key = childComponent.customIdParser(
							childComponent.customId
						).key
						const existingComponent =
							this.client.componentHandler.components.find(
								(comp) => comp.customIdParser(comp.customId).key === key
							)
						if (!existingComponent) {
							this.client.componentHandler.registerComponent(childComponent)
						}
					}
				}
			} else if (component instanceof Section) {
				if (component.accessory instanceof BaseMessageInteractiveComponent) {
					const key = component.accessory.customIdParser(
						component.accessory.customId
					).key
					const existingComponent =
						this.client.componentHandler.components.find(
							(comp) => comp.customIdParser(comp.customId).key === key
						)
					if (!existingComponent) {
						this.client.componentHandler.registerComponent(component.accessory)
					}
				}
			} else if (component instanceof Container) {
				this._internalRegisterComponentsOnSend(component.components)
			}
		}
	}

	/**
	 * Reply to an interaction.
	 * If the interaction is deferred, this will edit the original response.
	 * @param data The message data to send
	 */
	async reply(data: MessagePayload, overrideAutoRegister = false) {
		const serialized = serializePayload(data, this.defaultEphemeral)

		// Auto-register any components in the message
		if (!overrideAutoRegister) this._internalAutoRegisterComponentsOnSend(data)

		if (this._deferred) {
			const message = (await this.client.rest.patch(
				Routes.webhookMessage(
					this.client.options.clientId,
					this._rawData.token,
					"@original"
				),
				{
					body: serialized
				}
			)) as RESTPatchAPIWebhookWithTokenMessageResult
			return new Message(this.client, message)
		}
		const done = (await this.client.rest.post(
			Routes.interactionCallback(this._rawData.id, this._rawData.token),
			{
				body: {
					type: InteractionResponseType.ChannelMessageWithSource,
					data: serialized
				} satisfies RESTPostAPIInteractionCallbackJSONBody
			},
			{
				with_response: true
			}
		)) as RESTPostAPIInteractionCallbackWithResponseResult
		if (!done.resource?.message)
			throw new Error(
				`No resource returned for message from interaction callback: ${done.resource}`
			)
		return new Message(this.client, done.resource.message)
	}

	/**
	 * Set the default ephemeral value for this interaction
	 * @internal
	 */
	setDefaultEphemeral(ephemeral: boolean) {
		this.defaultEphemeral = ephemeral
	}

	/**
	 * Defer the interaction response. This is used automatically by commands that are set to defer.
	 * If the interaction is already deferred, this will do nothing.
	 * @internal
	 */
	async defer({ ephemeral = false } = {}) {
		if (this._deferred) return
		this._deferred = true
		await this.client.rest.post(
			Routes.interactionCallback(this._rawData.id, this._rawData.token),
			{
				body: {
					type: InteractionResponseType.DeferredChannelMessageWithSource,
					data: {
						flags:
							ephemeral || this.defaultEphemeral
								? MessageFlags.Ephemeral
								: undefined
					}
				} satisfies RESTPostAPIInteractionCallbackJSONBody
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

		const key = modal.customIdParser(modal.customId).key
		const existingModal = this.client.modalHandler.modals.find(
			(m) => m.customIdParser(m.customId).key === key
		)
		if (!existingModal) {
			this.client.modalHandler.registerModal(modal)
		}

		await this.client.rest.post(
			Routes.interactionCallback(this._rawData.id, this._rawData.token),
			{
				body: {
					type: InteractionResponseType.Modal,
					data: modal.serialize()
				} satisfies RESTPostAPIInteractionCallbackJSONBody
			}
		)
	}

	/**
	 * Send a followup message to the interaction
	 */
	async followUp(reply: MessagePayload) {
		const serialized = serializePayload(reply)

		// Auto-register any components in the message
		this._internalAutoRegisterComponentsOnSend(reply)

		await this.client.rest.post(
			Routes.webhook(this.client.options.clientId, this._rawData.token),
			{
				body: {
					...serialized
				} satisfies RESTPostAPIInteractionFollowupJSONBody
			}
		)
	}

	/**
	 * This function will reply to the interaction and wait for a component to be pressed.
	 * Any components passed in the message will not have run() functions called and
	 * will only trigger the interaction.acknowledge() function.
	 * This function will also return a promise that resolves
	 * to the custom ID of the component that was pressed.
	 *
	 * @param data The message data to send
	 * @param timeout After this many milliseconds, the promise will resolve to null
	 */
	async replyAndWaitForComponent(
		data: MessagePayload,
		timeout = 300000
	): Promise<
		| {
				/**
				 * Whether the interaction was successful
				 */
				success: true
				/**
				 * The custom ID of the component that was pressed
				 */
				customId: string
				/**
				 * If this is a select menu, this will be the values of the selected options
				 */
				values?: string[]
		  }
		| {
				/**
				 * Whether the interaction was successful
				 */
				success: false
				/**
				 * The reason the interaction failed
				 */
				reason: "timed out"
		  }
	> {
		const message = await this.reply(data, true)

		const id: `${string}-${string}` = `${message.id}-${message.channelId}`

		return new Promise((resolve) => {
			const timer = setTimeout(() => {
				this.client.componentHandler.oneOffComponents.delete(id)
				resolve({ success: false, reason: "timed out" })
			}, timeout)
			this.client.componentHandler.oneOffComponents.set(id, {
				resolve: (data: APIMessageComponentInteractionData) => {
					clearTimeout(timer)
					this.client.componentHandler.oneOffComponents.delete(id)
					resolve({
						success: true,
						customId: data.custom_id,
						values: "values" in data ? data.values : undefined
					})
				}
			})
		})
	}
}
