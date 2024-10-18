import {
	ApplicationCommandType,
	Command,
	type CommandInteraction
} from "@buape/carbon"

export default class UserCommand extends Command {
	name = "User Command"
	description = "User command test"
	defer = true
	type = ApplicationCommandType.User

	async run(interaction: CommandInteraction) {
		await interaction.reply({ content: "User command" })
	}
}
