import { ComponentType } from "discord-api-types/v10"
import { Base } from "../abstracts/Base.js"
import type { APIModalSubmitInteraction, Client } from "../index.js"

/**
 * This class is used to parse the options of a command, and provide errors for any missing or invalid options.
 * It is used internally by the Command class.
 */
export class FieldsHandler extends Base {
	/**
	 * The raw text input options that were in the interaction data, before they were parsed.
	 */
	readonly rawText: { [key: string]: string } = {}
	/**
	 * The raw string select options that were in the interaction data, before they were parsed.
	 */
	readonly rawStringSelect: { [key: string]: string[] } = {}
	/**
	 * The errors that were encountered while parsing the options.
	 */
	readonly errors: Array<string> = []

	constructor(client: Client, interaction: APIModalSubmitInteraction) {
		super(client)
		interaction.data.components.map((rowOrLabel) => {
			if (rowOrLabel.type === ComponentType.ActionRow) {
				rowOrLabel.components.map((component) => {
					if (component.type === ComponentType.TextInput) {
						this.rawText[component.custom_id] = component.value
					}
				})
			} else if (rowOrLabel.type === ComponentType.Label) {
				const component = rowOrLabel.component
				if (component.type === ComponentType.TextInput) {
					this.rawText[component.custom_id] = component.value
				} else if (component.type === ComponentType.StringSelect) {
					this.rawStringSelect[component.custom_id] = component.values
				}
			}
		})
	}

	/**
	 * Get the value of a text input.
	 * @param key The name of the input to get the value of.
	 * @returns The value of the input, or undefined if the input was not provided.
	 */
	public getText(key: string, required?: false): string | undefined
	public getText(key: string, required: true): string
	public getText(key: string, required = false) {
		const value = this.rawText[key]
		if (required) {
			if (!value || typeof value !== "string")
				throw new Error(`Missing required field: ${key}`)
		} else if (!value || typeof value !== "string") return undefined
		return value
	}

	public getStringSelect(key: string, required?: false): string[] | undefined
	public getStringSelect(key: string, required: true): string[]
	public getStringSelect(key: string, required = false) {
		const value = this.rawStringSelect[key]
		if (required) {
			if (!value || !Array.isArray(value))
				throw new Error(`Missing required field: ${key}`)
		} else if (!value || !Array.isArray(value)) return undefined
		return value
	}
}
