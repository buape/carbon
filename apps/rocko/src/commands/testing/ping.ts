import { Command, type CommandInteraction } from "@buape/carbon"

export default class PingCommand extends Command {
	name = "ping"
	description = "A simple ping command"
	defer = true

	async run(interaction: CommandInteraction) {
		interaction.reply({ content: "Pong" })
	}
}
