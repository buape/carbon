import { type APIApplicationCommandBasicOption, ApplicationCommandType } from "discord-api-types/v10";
import { BaseCommand } from "../structures/_BaseCommand.js";
import type { Command } from "./Command.js";

/**
 * Represents a subcommand command that the user creates.
 * You make this instead of a {@link Command} class when you want to have subcommands in your options.
 */
export abstract class CommandWithSubcommands extends BaseCommand {
	type = ApplicationCommandType.ChatInput
	abstract subcommands: Command[]

	serializeOptions(): APIApplicationCommandBasicOption[] {
		return this.subcommands.map((subcommand) => subcommand.serialize()) as unknown as APIApplicationCommandBasicOption[];
	}
}