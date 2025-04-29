import {
	type APIMessageComponentSelectMenuInteraction,
	type APIMessageSelectMenuInteractionData,
	InteractionType
} from "discord-api-types/v10"
import type { Client } from "../classes/Client.js"
import { BaseComponentInteraction } from "./BaseComponentInteraction.js"
import type { InteractionDefaults } from "./BaseInteraction.js"

export abstract class AnySelectMenuInteraction extends BaseComponentInteraction {
	constructor(
		client: Client,
		data: APIMessageComponentSelectMenuInteraction,
		defaults: InteractionDefaults
	) {
		super(client, data, defaults)
		if (!data.data)
			throw new Error("Invalid interaction data was used to create this class")
		if (data.type !== InteractionType.MessageComponent) {
			throw new Error("Invalid interaction type was used to create this class")
		}
	}

	/**
	 * The raw IDs of the selected options (either role/string/channel IDs or the IDs you provided in your options)
	 */
	get values(): string[] {
		return (this.rawData.data as APIMessageSelectMenuInteractionData).values
	}
}
