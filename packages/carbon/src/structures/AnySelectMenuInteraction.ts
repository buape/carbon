import {
	InteractionType,
	type APIMessageSelectMenuInteractionData,
	type APIMessageComponentSelectMenuInteraction
} from "discord-api-types/v10"
import type { Client } from "../classes/Client.js"
import { BaseComponentInteraction } from "./BaseComponentInteraction.js"
import { splitCustomId } from "../utils.js"

export abstract class AnySelectMenuInteraction extends BaseComponentInteraction {
	customId: string = splitCustomId(
		(this.rawData.data as APIMessageSelectMenuInteractionData).custom_id
	)[0]
	constructor(client: Client, data: APIMessageComponentSelectMenuInteraction) {
		super(client, data)
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
