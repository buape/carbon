import {
	type APIApplicationCommandBasicOption,
	type APIApplicationCommandSubcommandOption,
	ApplicationCommandOptionType,
	ApplicationCommandType,
	type RESTPostAPIApplicationCommandsJSONBody
} from "discord-api-types/v10"
import { BaseCommand } from "../abstracts/BaseCommand.js"
import type { Command } from "./Command.js"

/**
 * Represents a subcommand command that the user creates.
 * You make this instead of a {@link Command} class when you want to have subcommands in your options.
 */
export abstract class CommandWithSubcommands extends BaseCommand {
	type = ApplicationCommandType.ChatInput

	/**
	 * The subcommands that the user can use
	 */
	abstract subcommands: Command[]

	/**
	 * @internal
	 */

	serializeExtra() {
		const options: RESTPostAPIApplicationCommandsJSONBody["options"] =
			this.subcommands.map((subcommand) => {
				const serialized = subcommand.serializeExtra()
				return {
					name: subcommand.name,
					description: subcommand.description,
					type: ApplicationCommandOptionType.Subcommand,
					options: serialized.options as APIApplicationCommandBasicOption[]
				}
			}) satisfies APIApplicationCommandSubcommandOption[]

		return {
			options,
		}
	}
}
