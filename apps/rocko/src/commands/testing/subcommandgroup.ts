import {
	Command,
	type CommandInteraction,
	CommandWithSubcommandGroups,
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

class SubcommandsCommand1 extends CommandWithSubcommands {
	name = "subcommand1"
	description = "Subcommands!"
	defer = true

	subcommands = [new Command1(), new Command2()]
}

class SubcommandsCommand2 extends CommandWithSubcommands {
	name = "subcommand2"
	description = "Subcommands!"
	defer = true

	subcommands = [new Command1(), new Command2()]
}

export default class SubcommandGroupsCommand extends CommandWithSubcommandGroups {
	name = "subcommandgroups"
	description = "Subcommand group!"

	subcommandGroups = [new SubcommandsCommand1(), new SubcommandsCommand2()]
}
