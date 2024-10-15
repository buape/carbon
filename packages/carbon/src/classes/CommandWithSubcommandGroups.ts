import {
	type APIApplicationCommandBasicOption,
	type APIApplicationCommandSubcommandGroupOption,
	type APIApplicationCommandSubcommandOption,
	ApplicationCommandOptionType
} from "discord-api-types/v10"
import type { Command } from "./Command.js"
import { CommandWithSubcommands } from "./CommandWithSubcommands.js"

/**
 * Represents a subcommand group command that the user creates.
 * You make this instead of a {@link Command} class when you want to have subcommand groups in your options.
 */
export abstract class CommandWithSubcommandGroups extends CommandWithSubcommands {
	/**
	 * The subcommands that the user can use
	 */
	subcommands: Command[] = []

	/**
	 * The subcommands that the user can use
	 */
	abstract subcommandGroups: CommandWithSubcommands[]

	/**
	 * @internal
	 */
	serializeExtra() {
		const subcommands = this.subcommands.map((subcommand) => {
			const serialized = subcommand.serializeExtra()
			return {
				name: subcommand.name,
				description: subcommand.description,
				type: ApplicationCommandOptionType.Subcommand,
				options: serialized.options as APIApplicationCommandBasicOption[]
			}
		}) satisfies APIApplicationCommandSubcommandOption[]

		const subcommandGroups = this.subcommandGroups.map((subcommandGroup) => {
			const serialized = subcommandGroup.serializeExtra()
			return {
				name: subcommandGroup.name,
				description: subcommandGroup.description,
				type: ApplicationCommandOptionType.SubcommandGroup,
				options: serialized.options as APIApplicationCommandSubcommandOption[]
			}
		}) satisfies APIApplicationCommandSubcommandGroupOption[]

		return {
			options: [...subcommands, ...subcommandGroups]
		}
	}
}
