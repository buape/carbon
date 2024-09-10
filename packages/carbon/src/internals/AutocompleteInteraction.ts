import {
	type APIApplicationCommandAutocompleteInteraction,
	type APIApplicationCommandInteractionDataBasicOption,
	ApplicationCommandOptionType,
	ApplicationCommandType,
	InteractionResponseType,
	InteractionType,
	Routes
} from "discord-api-types/v10"
import type { BaseCommand } from "../abstracts/BaseCommand.js"
import { BaseInteraction } from "../abstracts/BaseInteraction.js"
import type { Client } from "../classes/Client.js"
import { Command } from "../classes/Command.js"
import { OptionsHandler } from "./OptionsHandler.js"

export class AutocompleteInteraction extends BaseInteraction<APIApplicationCommandAutocompleteInteraction> {
	/**
	 * This is the options of the commands, parsed from the interaction data.
	 */
	options?: AutocompleteOptionsHandler
	constructor(
		client: Client,
		data: APIApplicationCommandAutocompleteInteraction,
		command?: BaseCommand
	) {
		super(client, data)
		if (data.type !== InteractionType.ApplicationCommandAutocomplete) {
			throw new Error("Invalid interaction type was used to create this class")
		}
		if (data.data.type !== ApplicationCommandType.ChatInput) {
			throw new Error("Invalid command type was used to create this class")
		}
		if (
			command instanceof Command &&
			!data.data.options?.find(
				(x) =>
					x.type === ApplicationCommandOptionType.Subcommand ||
					x.type === ApplicationCommandOptionType.SubcommandGroup
			)
		) {
			this.options = new AutocompleteOptionsHandler(
				client,
				(data.data.options ??
					[]) as APIApplicationCommandInteractionDataBasicOption[]
			)
		}
	}

	override async defer() {
		throw new Error("Defer is not available for autocomplete interactions")
	}

	override async reply() {
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
		switch (focused.type) {
			case ApplicationCommandOptionType.String:
				return this.getString(focused.name)
			case ApplicationCommandOptionType.Integer:
				return this.getInteger(focused.name)
			case ApplicationCommandOptionType.Number:
				return this.getNumber(focused.name)
			case ApplicationCommandOptionType.Boolean:
				return this.getBoolean(focused.name)
			default:
				return null
		}
	}
}
