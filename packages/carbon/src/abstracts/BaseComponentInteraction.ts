import {
	type APIMessageComponentInteraction,
	type ComponentType,
	InteractionResponseType,
	type RESTPostAPIInteractionCallbackJSONBody,
	Routes
} from "discord-api-types/v10"
import type { Client } from "../classes/Client.js"
import { serializePayload, splitCustomId } from "../utils.js"
import {
	BaseInteraction,
	type InteractionDefaults,
	type InteractionReplyOptions
} from "./BaseInteraction.js"
import type { MessagePayload } from "../types.js"

export class BaseComponentInteraction extends BaseInteraction<APIMessageComponentInteraction> {
	customId: string
	componentType: ComponentType
	constructor(
		client: Client,
		data: APIMessageComponentInteraction,
		defaults: InteractionDefaults
	) {
		super(client, data, defaults)
		if (!data.data)
			throw new Error("Invalid interaction data was used to create this class")
		this.customId = splitCustomId(data.data.custom_id)[0]
		this.componentType = data.data.component_type
	}

	/**
	 * Acknowledge the interaction, the user does not see a loading state.
	 * This can only be used for component interactions
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
	 * Update the original message of the component
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
