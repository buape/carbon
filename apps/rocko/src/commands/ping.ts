import { Command, type CommandInteraction } from "@buape/carbon"

export default class PingCommand extends Command {
	name = "ping"
	description = "Replies with Pong!"

	async run(interaction: CommandInteraction) {
		await interaction.reply("Pong! Hello from rocko!")
	}
}
