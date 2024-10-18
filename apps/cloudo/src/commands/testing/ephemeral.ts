import {
	Command,
	type CommandInteraction,
	CommandWithSubcommands
} from "@buape/carbon"

class EphemeralNoDefer extends Command {
	name = "no-defer"
	description = "Ephemeral test"
	ephemeral = true
	defer = false

	async run(interaction: CommandInteraction): Promise<void> {
		await interaction.reply({ content: "Ephemeral no defer" })
	}
}

class EphemeralDefer extends Command {
	name = "defer"
	description = "Ephemeral test"
	ephemeral = true
	defer = true

	async run(interaction: CommandInteraction): Promise<void> {
		await interaction.reply({ content: "Ephemeral defer" })
	}
}

export default class EphemeralCommand extends CommandWithSubcommands {
	name = "ephemeral"
	description = "Ephemeral test"
	ephemeral = true

	subcommands = [new EphemeralNoDefer(), new EphemeralDefer()]
}
