import {
	type APIApplicationCommandBasicOption,
	ApplicationCommandType,
	type PermissionFlagsBits
} from "discord-api-types/v10"
import {
	type AutocompleteInteraction,
	BaseCommand,
	type CommandInteraction
} from "../index.js"

export type CommandOptions = APIApplicationCommandBasicOption[]
export type PermissionFlags = keyof typeof PermissionFlagsBits

/**
 * Represents a standard command that the user creates
 */
export abstract class Command extends BaseCommand {
	/**
	 * The options that the user passes along with the command in Discord
	 */
	options?: CommandOptions
	/**
	 *  The default permissions a user must have to see and use the command in Discord
	 */
	permissions?: PermissionFlags
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
	serializeExtra() {
		return { options: this.options, permissions: this.permissions }
	}
}
