import {
	type APIMessageComponentSelectMenuInteraction,
	type APIMessageMentionableSelectInteractionData,
	ComponentType
} from "discord-api-types/v10"
import { AnySelectMenuInteraction } from "../abstracts/AnySelectMenuInteraction.js"
import type { Client } from "../classes/Client.js"
import type { InteractionDefaults } from "../abstracts/BaseInteraction.js"

export class MentionableSelectMenuInteraction extends AnySelectMenuInteraction {
	constructor(
		client: Client,
		data: APIMessageComponentSelectMenuInteraction,
		defaults: InteractionDefaults
	) {
		super(client, data, defaults)
		if (data.data.component_type !== ComponentType.MentionableSelect) {
			throw new Error("Invalid component type was used to create this class")
		}
	}

	get values(): string[] {
		return (this.rawData.data as APIMessageMentionableSelectInteractionData)
			.values
	}
}
