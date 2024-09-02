import {
	type APIApplicationCommandInteraction,
	type APIApplicationCommandInteractionDataBasicOption,
	ApplicationCommandOptionType,
	ApplicationCommandType,
	InteractionType
} from "discord-api-types/v10"
import type { BaseCommand } from "../abstracts/BaseCommand.js"
import { BaseInteraction } from "../abstracts/BaseInteraction.js"
import type { Client } from "../classes/Client.js"
import { Command } from "../classes/Command.js"
import { OptionsHandler } from "./OptionsHandler.js"
// import type { RawOptions } from "./OptionsHandler.js"

/**
 * Represents a command interaction
 */
export class CommandInteraction extends BaseInteraction<APIApplicationCommandInteraction> {
	/**
	 * This is the options of the commands, parsed from the interaction data.
	 * It is only available if the command is a {@link Command} class.
	 */
	options?: OptionsHandler
	constructor(
		client: Client,
		data: APIApplicationCommandInteraction,
		command?: BaseCommand
	) {
		super(client, data)
		if (data.type !== InteractionType.ApplicationCommand) {
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
			this.options = new OptionsHandler(
				client,
				(data.data.options ??
					[]) as APIApplicationCommandInteractionDataBasicOption[]
			)
		}
	}
}
