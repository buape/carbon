import { Command, type CommandInteraction, Permission } from "@buape/carbon"

export default class PermissionCommand extends Command {
	name = "manage_server"
	description = "You need the manage server permission to see this command"
	permission = Permission.ManageGuild

	async run(interaction: CommandInteraction): Promise<void> {
		interaction.reply("You can see this command")
	}
}
