import {
	type APIMessageButtonInteractionData,
	type APIMessageComponentButtonInteraction,
	ComponentType,
	InteractionType
} from "discord-api-types/v10"
import { BaseComponentInteraction } from "../abstracts/BaseComponentInteraction.js"
import type { Client } from "../classes/Client.js"
import { splitCustomId } from "../utils.js"

export class ButtonInteraction extends BaseComponentInteraction {
	customId: string = splitCustomId(
		(this.rawData.data as APIMessageButtonInteractionData).custom_id
	)[0]
	constructor(client: Client, data: APIMessageComponentButtonInteraction) {
		super(client, data)
		if (!data.data)
			throw new Error("Invalid interaction data was used to create this class")
		if (data.type !== InteractionType.MessageComponent) {
			throw new Error("Invalid interaction type was used to create this class")
		}
		if (data.data.component_type !== ComponentType.Button) {
			throw new Error("Invalid component type was used to create this class")
		}
	}
}
