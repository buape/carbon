import {
	Command,
	type CommandInteraction,
	CommandWithSubcommands
} from "@buape/carbon"

class Command1 extends Command {
	name = "command1"
	description = "Subcommand 1"
	defer = true

	async run(interaction: CommandInteraction) {
		await interaction.reply({ content: "Subcommand 1" })
	}
}

class Command2 extends Command {
	name = "command2"
	description = "Subcommand 2"
	defer = true

	async run(interaction: CommandInteraction) {
		await interaction.reply({ content: "Subcommand 2" })
	}
}

export default class SubcommandsCommand extends CommandWithSubcommands {
	name = "subcommands"
	description = "Subcommands!"
	defer = true

	subcommands = [new Command1(), new Command2()]
}
