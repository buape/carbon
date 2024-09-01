import {
	type APIApplicationCommandBasicOption,
	ApplicationCommandType
} from "discord-api-types/v10"
import { BaseCommand } from "../abstracts/BaseCommand.js"
import type { CommandInteraction } from "../internals/CommandInteraction.js"

export type CommandOptions = APIApplicationCommandBasicOption[]

/**
 * Represents a standard command that the user creates
 */
export abstract class Command extends BaseCommand {
	type = ApplicationCommandType.ChatInput

	/**
	 * The options that the user passes along with the command in Discord
	 */
	options?: CommandOptions

	/**
	 * The function that is called when the command is ran
	 * @param interaction The interaction that triggered the command
	 */
	abstract run(interaction: CommandInteraction): Promise<void>

	/**
	 * @internal
	 */
	serializeOptions() {
		return this.options
	}
}
