import { ComponentType } from "discord-api-types/v10"
import { Base } from "../abstracts/Base.js"
import type { APIModalSubmitInteraction, Client } from "../index.js"

/**
 * This class is used to parse the options of a command, and provide errors for any missing or invalid options.
 * It is used internally by the Command class.
 */
export class FieldsHandler extends Base {
	/**
	 * The raw options that were in the interaction data, before they were parsed.
	 */
	readonly raw: { [key: string]: string } = {}
	/**
	 * The errors that were encountered while parsing the options.
	 */
	readonly errors: Array<string> = []

	constructor(client: Client, interaction: APIModalSubmitInteraction) {
		super(client)
		interaction.data.components.map((row) => {
			row.components.map((component) => {
				if (component.type === ComponentType.TextInput) {
					this.raw[component.custom_id] = component.value
				}
			})
		})
	}

	/**
	 * Get the value of a text input.
	 * @param key The name of the input to get the value of.
	 * @returns The value of the input, or undefined if the input was not provided.
	 */
	public getText(key: string) {
		const value = this.raw[key]
		if (!value || typeof value !== "string") return undefined
		return value
	}
}
