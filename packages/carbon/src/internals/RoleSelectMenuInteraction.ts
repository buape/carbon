import {
	type APIMessageComponentSelectMenuInteraction,
	type APIMessageRoleSelectInteractionData,
	ComponentType
} from "discord-api-types/v10"
import { AnySelectMenuInteraction } from "../abstracts/AnySelectMenuInteraction.js"
import type { InteractionDefaults } from "../abstracts/BaseInteraction.js"
import type { Client } from "../classes/Client.js"
import type { RoleId } from "../types/index.js"

export class RoleSelectMenuInteraction extends AnySelectMenuInteraction {
	constructor(
		client: Client,
		data: APIMessageComponentSelectMenuInteraction,
		defaults: InteractionDefaults
	) {
		super(client, data, defaults)
		if (data.data.component_type !== ComponentType.RoleSelect) {
			throw new Error("Invalid component type was used to create this class")
		}
	}

	get values(): RoleId[] {
		return (this.rawData.data as APIMessageRoleSelectInteractionData)
			.values as RoleId[]
	}
}
