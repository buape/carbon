import { Command, type CommandInteraction } from "@buape/carbon"

export default class EphemeralCommand extends Command {
	name = "ephemeral-shorthand"
	description = "The ephemeral: true shorthand test"

	async run(interaction: CommandInteraction) {
		await interaction.reply({
			content: "Ephemeral shorthand test",
			ephemeral: true
		})
	}
}
