import { Command, type CommandInteraction } from "@buape/carbon"

export default class PingCommand extends Command {
	name = "ping"
	description = "A simple ping command"
	defer = true

	async run(interaction: CommandInteraction) {
		await interaction.reply({
			content: "Pong <:caughtIn4k:1145473115703496816>"
		})
	}
}
