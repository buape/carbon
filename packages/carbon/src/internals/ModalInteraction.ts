import {
	ComponentType,
	type APIModalSubmitInteraction
} from "discord-api-types/v10"
import { BaseInteraction } from "../abstracts/BaseInteraction.js"
import type { Client } from "../index.js"

export class ModalInteraction extends BaseInteraction<APIModalSubmitInteraction> {
	customId: string
	values: { [key: string]: string }

	constructor(client: Client, data: APIModalSubmitInteraction) {
		super(client, data)

		this.customId = data.data.custom_id
		this.values = {}
		data.data.components.map((row) => {
			row.components.map((component) => {
				if (component.type === ComponentType.TextInput) {
					this.values[component.custom_id] = component.value
				}
			})
		})
	}
}
