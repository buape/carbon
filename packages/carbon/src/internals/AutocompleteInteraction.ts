import {
	type APIApplicationCommandAutocompleteInteraction,
	ApplicationCommandOptionType,
	ApplicationCommandType,
	InteractionResponseType,
	InteractionType,
	Routes
} from "discord-api-types/v10"
import {
	BaseInteraction,
	type InteractionDefaults
} from "../abstracts/BaseInteraction.js"
import type { Client } from "../classes/Client.js"
import { OptionsHandler } from "./OptionsHandler.js"

export class AutocompleteInteraction extends BaseInteraction<APIApplicationCommandAutocompleteInteraction> {
	/**
	 * This is the options of the commands, parsed from the interaction data.
	 */
	options: AutocompleteOptionsHandler
	constructor(
		client: Client,
		data: APIApplicationCommandAutocompleteInteraction,
		defaults: InteractionDefaults
	) {
		super(client, data, defaults)
		if (data.type !== InteractionType.ApplicationCommandAutocomplete) {
			throw new Error("Invalid interaction type was used to create this class")
		}
		if (data.data.type !== ApplicationCommandType.ChatInput) {
			throw new Error("Invalid command type was used to create this class")
		}

		this.options = new AutocompleteOptionsHandler(
			client,
			data.data.options ?? []
		)
	}

	override async defer(): Promise<never> {
		throw new Error("Defer is not available for autocomplete interactions")
	}

	override async reply(): Promise<never> {
		throw new Error("Reply is not available for autocomplete interactions")
	}

	/**
	 * Respond with the choices for an autocomplete interaction
	 */
	async respond(
		choices: {
			/**
			 * The name of the choice, this is what the user will see
			 */
			name: string
			/**
			 * The value of the choice, this is what the bot will receive from Discord as the value
			 */
			value: string
		}[]
	) {
		await this.client.rest.post(
			Routes.interactionCallback(this.rawData.id, this.rawData.token),
			{
				body: {
					type: InteractionResponseType.ApplicationCommandAutocompleteResult,
					data: {
						choices
					}
				}
			}
		)
	}
}

export class AutocompleteOptionsHandler extends OptionsHandler {
	/**
	 * Get the focused option (the one that is being autocompleted)
	 */
	getFocused() {
		const focused = this.raw.find((x) => "focused" in x && x.focused)
		if (!focused) return null
		const value =
			focused.type === ApplicationCommandOptionType.String
				? this.getString(focused.name)
				: focused.type === ApplicationCommandOptionType.Integer
					? this.getInteger(focused.name)
					: focused.type === ApplicationCommandOptionType.Number
						? this.getNumber(focused.name)
						: focused.type === ApplicationCommandOptionType.Boolean
							? this.getBoolean(focused.name)
							: null

		return {
			name: focused.name,
			type: focused.type,
			value: value
		}
	}
}
