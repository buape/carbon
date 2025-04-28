import {
	Command,
	type CommandInteraction,
	CommandWithSubcommands
} from "@buape/carbon"

class PrecheckPass extends Command {
	name = "pass"
	description = "Precheck test that always passes"

	async preCheck(): Promise<boolean> {
		return true
	}

	async run(interaction: CommandInteraction): Promise<void> {
		await interaction.reply({ content: "Precheck passed!" })
	}
}

class PrecheckUsername extends Command {
	name = "username"
	description = "Precheck test that checks username starts with 'a'"

	async preCheck(interaction: CommandInteraction) {
		if (!interaction.user) return false
		if (!interaction.user.username.toLowerCase().startsWith("a")) {
			return interaction.reply({
				content: "Your username does not start with 'a'!"
			})
		}
		return true
	}

	async run(interaction: CommandInteraction): Promise<void> {
		await interaction.reply({ content: "Your username starts with 'a'!" })
	}
}

export default class PrecheckCommand extends CommandWithSubcommands {
	name = "precheck"
	description = "precheck things"

	subcommands = [new PrecheckPass(), new PrecheckUsername()]
}
