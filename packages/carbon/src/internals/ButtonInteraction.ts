import {
	type APIMessageComponentButtonInteraction,
	ComponentType,
	InteractionType
} from "discord-api-types/v10"
import { BaseComponentInteraction } from "../abstracts/BaseComponentInteraction.js"
import type { InteractionDefaults } from "../abstracts/BaseInteraction.js"
import type { Client } from "../classes/Client.js"

export class ButtonInteraction extends BaseComponentInteraction {
	constructor(
		client: Client,
		data: APIMessageComponentButtonInteraction,
		defaults: InteractionDefaults
	) {
		super(client, data, defaults)
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
