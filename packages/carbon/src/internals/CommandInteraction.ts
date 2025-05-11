import {
	type APIApplicationCommandInteraction,
	type APIChatInputApplicationCommandInteractionData,
	ApplicationCommandType,
	InteractionType
} from "discord-api-types/v10"
import {
	BaseInteraction,
	type InteractionDefaults
} from "../abstracts/BaseInteraction.js"
import type { Client } from "../classes/Client.js"
import { OptionsHandler } from "./OptionsHandler.js"

/**
 * Represents a command interaction
 */
export class CommandInteraction extends BaseInteraction<APIApplicationCommandInteraction> {
	/**
	 * This is the options of the commands, parsed from the interaction data.
	 * It will not have any options in it if the command is not a ChatInput command.
	 */
	options: OptionsHandler
	constructor(
		client: Client,
		data: APIApplicationCommandInteraction,
		defaults: InteractionDefaults
	) {
		super(client, data, defaults)
		if (data.type !== InteractionType.ApplicationCommand) {
			throw new Error("Invalid interaction type was used to create this class")
		}
		this.options = new OptionsHandler(
			client,
			data.data.type === ApplicationCommandType.ChatInput
				? (data.data.options ?? [])
				: [],
			this.rawData.data as APIChatInputApplicationCommandInteractionData
		)
	}
}
