import {
	type APIMessageComponentSelectMenuInteraction,
	type APIMessageStringSelectInteractionData,
	ComponentType
} from "discord-api-types/v10"
import type { Client } from "../classes/Client.js"
import { AnySelectMenuInteraction } from "./AnySelectMenuInteraction.js"

export class StringSelectMenuInteraction extends AnySelectMenuInteraction {
	constructor(client: Client, data: APIMessageComponentSelectMenuInteraction) {
		super(client, data)
		if (data.data.component_type !== ComponentType.StringSelect) {
			throw new Error("Invalid component type was used to create this class")
		}
	}

	get values(): string[] {
		return (this.rawData.data as APIMessageStringSelectInteractionData).values
	}
}
