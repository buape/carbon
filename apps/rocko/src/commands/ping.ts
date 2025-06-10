import { Command, type CommandInteraction } from "@buape/carbon"

export default class PingCommand extends Command {
	name = "ping"
	description = "Replies with Pong!"

	/**
	 * Only deploy this command to the specified guild(s).
	 * Example: replace with your test guild ID
	 */
	guildIds = ["1041045270659604701"]

	async run(interaction: CommandInteraction) {
		await interaction.reply("Pong! Hello from rocko!")
	}
}
