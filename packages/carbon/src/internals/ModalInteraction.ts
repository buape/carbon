import {
	type APIModalSubmitInteraction,
	InteractionResponseType,
	type RESTPostAPIInteractionCallbackJSONBody,
	Routes
} from "discord-api-types/v10"
import { BaseInteraction } from "../abstracts/BaseInteraction.js"
import type { Client, InteractionDefaults } from "../index.js"
import type { MessagePayload } from "../types/index.js"
import { serializePayload } from "../utils/index.js"
import { FieldsHandler } from "./FieldsHandler.js"

export class ModalInteraction extends BaseInteraction<APIModalSubmitInteraction> {
	customId: string
	fields: FieldsHandler

	constructor(
		client: Client,
		data: APIModalSubmitInteraction,
		defaults: InteractionDefaults
	) {
		super(client, data, defaults)

		this.customId = data.data.custom_id
		this.fields = new FieldsHandler(client, data)
	}

	/**
	 * Acknowledge the interaction, the user does not see a loading state.
	 * This can only be used for modals triggered from components
	 */
	async acknowledge() {
		const body = {
			type: InteractionResponseType.DeferredMessageUpdate
		} as RESTPostAPIInteractionCallbackJSONBody
		this.client.options?.testHooks?.emit?.({
			type: "interaction:response",
			kind: "acknowledge",
			interactionId: this.rawData.id,
			body
		})
		await this.client.rest.post(
			Routes.interactionCallback(this.rawData.id, this.rawData.token),
			{
				body
			}
		)
		this._deferred = true
	}

	/**
	 * Update the original message of the component.
	 * This can only be used for modals triggered from components
	 */
	async update(data: MessagePayload) {
		const serialized = serializePayload(data)
		const body = {
			type: InteractionResponseType.UpdateMessage,
			data: {
				...serialized
			}
		} as RESTPostAPIInteractionCallbackJSONBody
		this.client.options?.testHooks?.emit?.({
			type: "interaction:response",
			kind: "update",
			interactionId: this.rawData.id,
			body
		})
		await this.client.rest.post(
			Routes.interactionCallback(this.rawData.id, this.rawData.token),
			{
				body
			}
		)
	}
}
