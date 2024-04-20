import {
	Command,
	type CommandInteraction,
	CommandWithSubcommandGroups,
	CommandWithSubcommands
} from "@buape/carbon"

class Sub1 extends Command {
	name = "sub1"
	description = "Subcommand 1"
	defer = true

	async run(interaction: CommandInteraction) {
		interaction.reply({ content: "Subcommand 1" })
	}
}

class Sub2 extends Command {
	name = "sub2"
	description = "Subcommand 2"
	defer = true

	async run(interaction: CommandInteraction) {
		interaction.reply({ content: "Subcommand 2" })
	}
}

class Subc extends CommandWithSubcommands {
	name = "subc"
	description = "Subcommands!"
	defer = true

	subcommands = [new Sub1(), new Sub2()]
}

class Subc2 extends CommandWithSubcommands {
	name = "subc2"
	description = "Subcommands!"
	defer = true

	subcommands = [new Sub1(), new Sub2()]
}

export default class SubcG extends CommandWithSubcommandGroups {
	name = "subg"
	description = "Subcommand group!"

	subcommandGroups = [new Subc(), new Subc2()]
}
