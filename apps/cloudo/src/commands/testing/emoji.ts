import { Command, type CommandInteraction } from "@buape/carbon"

export default class EmojiCommand extends Command {
	name = "emoji"
	description = "Application Emoji Test"
	defer = true

	async run(interaction: CommandInteraction) {
		const emoji = await interaction.client.emoji.getByName("carbon")
		await interaction.reply({
			content: `${emoji ?? "No emoji found"}`
		})
	}
}
