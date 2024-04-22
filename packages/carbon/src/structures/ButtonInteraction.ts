import {
	ComponentType,
	InteractionType,
	type APIMessageComponentButtonInteraction
} from "discord-api-types/v10"
import type { Client } from "../classes/Client.js"
import { BaseComponentInteraction } from "./BaseInteraction.js"

export class ButtonInteraction extends BaseComponentInteraction {
	constructor(client: Client, data: APIMessageComponentButtonInteraction) {
		super(client, data)
		if (data.type !== InteractionType.MessageComponent) {
			throw new Error("Invalid interaction type was used to create this class")
		}
		if (data.data.component_type !== ComponentType.Button) {
			throw new Error("Invalid component type was used to create this class")
		}
	}
}
