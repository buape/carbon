import {
	type APIApplicationCommandBasicOption,
	ApplicationCommandType
} from "discord-api-types/v10"
import type { CommandInteraction } from "../structures/CommandInteraction.js"
import { BaseCommand } from "../structures/BaseCommand.js"

/**
 * Represents a standard command that the user creates
 */
export abstract class Command extends BaseCommand {
	type = ApplicationCommandType.ChatInput

	options?: APIApplicationCommandBasicOption[] = []

	/**
	 * The function that is called when the command is ran
	 * @param interaction The interaction that triggered the command
	 */
	abstract run(interaction: CommandInteraction): Promise<void>

	serializeOptions() {
		return this.options
	}
}
