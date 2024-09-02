import {
	type APIApplicationCommandBasicOption,
	ApplicationCommandType
} from "discord-api-types/v10"
import { BaseCommand } from "../abstracts/BaseCommand.js"
import type { CommandInteraction } from "../internals/CommandInteraction.js"
import type { AutocompleteInteraction } from "../internals/AutocompleteInteraction.js"

export type CommandOptions = APIApplicationCommandBasicOption[]

/**
 * Represents a standard command that the user creates
 */
export abstract class Command extends BaseCommand {
	/**
	 * The options that the user passes along with the command in Discord
	 */
	options?: CommandOptions

	/**
	 * The type of command, either ChatInput, User, or Message. User and Message are context menu commands.
	 * @default ChatInput
	 */
	type: ApplicationCommandType = ApplicationCommandType.ChatInput

	/**
	 * The function that is called when the command is ran
	 * @param interaction The interaction that triggered the command
	 */
	abstract run(interaction: CommandInteraction): Promise<void>

	/**
	 * The function that is called when the command's autocomplete is triggered.
	 * @param interaction The interaction that triggered the autocomplete
	 * @remarks You are expected to `override` this function to provide your own autocomplete functionality.
	 */
	public async autocomplete(
		interaction: AutocompleteInteraction
	): Promise<void> {
		throw new Error(
			`The ${interaction.rawData.data.name} command does not support autocomplete`
		)
	}

	/**
	 * @internal
	 */
	serializeOptions() {
		return this.options
	}
}
