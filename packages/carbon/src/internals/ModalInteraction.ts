import type { APIModalSubmitInteraction } from "discord-api-types/v10"
import { BaseInteraction } from "../abstracts/BaseInteraction.js"
import type { Client } from "../index.js"
import { FieldsHandler } from "./FieldsHandler.js"

export class ModalInteraction extends BaseInteraction<APIModalSubmitInteraction> {
	customId: string
	fields: FieldsHandler

	constructor(client: Client, data: APIModalSubmitInteraction) {
		super(client, data)

		this.customId = data.data.custom_id
		this.fields = new FieldsHandler(client, data)
	}
}
