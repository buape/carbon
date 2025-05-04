import {
	type APIChannel,
	type APIInteraction,
	InteractionResponseType,
	type InteractionType,
	MessageFlags,
	type RESTPostAPIInteractionCallbackJSONBody,
	type RESTPostAPIInteractionFollowupJSONBody,
	Routes
} from "discord-api-types/v10"
import {
	BaseMessageInteractiveComponent,
	Button,
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

	get guild(): Guild<true> | null {
		if (!this.rawData.guild_id) return null
		return new Guild<true>(this.client, this.rawData.guild_id)
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

	private autoRegisterComponents(data: MessagePayload) {
		if (typeof data !== "string" && data.components) {
			this.registerComponents(data.components)
		}
	}
	private registerComponents(components: TopLevelComponents[]) {
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
				if (component.accessory instanceof Button) {
					this.client.componentHandler.registerComponent(component.accessory)
				}
			} else if (component instanceof Container) {
				this.registerComponents(component.components)
			}
		}
	}

	/**
	 * Reply to an interaction.
	 * If the interaction is deferred, this will edit the original response.
	 * @param data The response data
	 */
	async reply(data: MessagePayload) {
		const serialized = serializePayload(data, this.defaultEphemeral)

		// Auto-register any components in the message
		this.autoRegisterComponents(data)

		if (this._deferred) {
			await this.client.rest.patch(
				Routes.webhookMessage(
					this.client.options.clientId,
					this.rawData.token,
					"@original"
				),
				{
					body: serialized
				}
			)
		} else {
			await this.client.rest.post(
				Routes.interactionCallback(this.rawData.id, this.rawData.token),
				{
					body: {
						type: InteractionResponseType.ChannelMessageWithSource,
						data: serialized
					} satisfies RESTPostAPIInteractionCallbackJSONBody
				}
			)
		}
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
			Routes.interactionCallback(this.rawData.id, this.rawData.token),
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
			Routes.interactionCallback(this.rawData.id, this.rawData.token),
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
		this.autoRegisterComponents(reply)

		await this.client.rest.post(
			Routes.webhook(this.client.options.clientId, this.rawData.token),
			{
				body: {
					...serialized
				} satisfies RESTPostAPIInteractionFollowupJSONBody
			}
		)
	}
}
