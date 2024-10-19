import {
	Command,
	PermissionFlags,
	PermissionFlagsBits,
	type CommandInteraction
} from "@buape/carbon"

export default class PermissionCommand extends Command {
	name = "permission"
	description = "A simple command to check permission"
	permissions = PermissionFlagsBits.Administrator

	async run(interaction: CommandInteraction) {
		return interaction.reply({
			content: "You are an admin!"
		})
	}
}
