import {
	type APIMessageComponentSelectMenuInteraction,
	ComponentType
} from "discord-api-types/v10"
import type { Client } from "../classes/Client.js"
import { AnySelectMenuInteraction } from "../abstracts/AnySelectMenuInteraction.js"

export class ChannelSelectMenuInteraction extends AnySelectMenuInteraction {
	constructor(client: Client, data: APIMessageComponentSelectMenuInteraction) {
		super(client, data)
		if (data.data.component_type !== ComponentType.ChannelSelect) {
			throw new Error("Invalid component type was used to create this class")
		}
	}
}
