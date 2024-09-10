import {
	type APIMessageComponentSelectMenuInteraction,
	type APIMessageStringSelectInteractionData,
	ComponentType
} from "discord-api-types/v10"
import { AnySelectMenuInteraction } from "../abstracts/AnySelectMenuInteraction.js"
import type { InteractionDefaults } from "../abstracts/BaseInteraction.js"
import type { Client } from "../classes/Client.js"

export class StringSelectMenuInteraction extends AnySelectMenuInteraction {
	constructor(
		client: Client,
		data: APIMessageComponentSelectMenuInteraction,
		defaults: InteractionDefaults
	) {
		super(client, data, defaults)
		if (data.data.component_type !== ComponentType.StringSelect) {
			throw new Error("Invalid component type was used to create this class")
		}
	}

	get values(): string[] {
		return (this.rawData.data as APIMessageStringSelectInteractionData).values
	}
}
