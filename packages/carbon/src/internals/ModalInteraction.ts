import {
	type APIModalSubmitInteraction,
	InteractionResponseType,
	type RESTPostAPIInteractionCallbackJSONBody,
	Routes
} from "discord-api-types/v10"
import { BaseInteraction } from "../abstracts/BaseInteraction.js"
import type { InteractionReplyOptions } from "../abstracts/BaseInteraction.js"
import type { Client, InteractionDefaults } from "../index.js"
import { FieldsHandler } from "./FieldsHandler.js"
import type { MessagePayload } from "../types.js"
import { serializePayload } from "../utils.js"

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
		await this.client.rest.post(
			Routes.interactionCallback(this.rawData.id, this.rawData.token),
			{
				body: {
					type: InteractionResponseType.DeferredMessageUpdate
				} as RESTPostAPIInteractionCallbackJSONBody
			}
		)
		this._deferred = true
	}

	/**
	 * Update the original message of the component.
	 * This can only be used for modals triggered from components
	 */
	async update(
		data: MessagePayload,
		options: Pick<InteractionReplyOptions, "files"> = {}
	) {
		const serialized = serializePayload(data)
		await this.client.rest.post(
			Routes.interactionCallback(this.rawData.id, this.rawData.token),
			{
				body: {
					type: InteractionResponseType.UpdateMessage,
					data: {
						...serialized
					}
				} as RESTPostAPIInteractionCallbackJSONBody,
				files: options.files
			}
		)
	}
}
