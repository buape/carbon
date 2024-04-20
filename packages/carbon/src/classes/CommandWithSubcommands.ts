import {
	type APIApplicationCommandBasicOption,
	ApplicationCommandType
} from "discord-api-types/v10"
import { BaseCommand } from "../structures/BaseCommand.js"
import type { Command } from "./Command.js"

/**
 * Represents a subcommand command that the user creates.
 * You make this instead of a {@apilink Command} class when you want to have subcommands in your options.
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
	serializeOptions(): APIApplicationCommandBasicOption[] {
		return this.subcommands.map((subcommand) =>
			subcommand.serialize()
		) as unknown as APIApplicationCommandBasicOption[]
	}
}
