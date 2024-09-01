import {
	type APIMessageComponentSelectMenuInteraction,
	type APIMessageRoleSelectInteractionData,
	ComponentType
} from "discord-api-types/v10"
import { AnySelectMenuInteraction } from "../abstracts/AnySelectMenuInteraction.js"
import type { Client } from "../classes/Client.js"

export class RoleSelectMenuInteraction extends AnySelectMenuInteraction {
	constructor(client: Client, data: APIMessageComponentSelectMenuInteraction) {
		super(client, data)
		if (data.data.component_type !== ComponentType.RoleSelect) {
			throw new Error("Invalid component type was used to create this class")
		}
	}

	get values(): string[] {
		return (this.rawData.data as APIMessageRoleSelectInteractionData).values
	}
}
