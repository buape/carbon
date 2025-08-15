import {
	Command,
	type CommandInteraction,
	Embed,
	Paginator
} from "@buape/carbon"

export default class PaginatorCommand extends Command {
	name = "paginator"
	description = "Test the paginator with go-to-page functionality"

	async run(interaction: CommandInteraction) {
		// Create multiple pages for testing
		const pages = Array.from({ length: 10 }, (_, i) => {
			const embed = new Embed()
			embed.title = `Page ${i + 1}`
			embed.description = `This is page ${i + 1} out of 10 pages.`
			embed.color = 0x3498db
			embed.fields = [
				{
					name: "Page Info",
					value: "You can navigate using the buttons below.",
					inline: false
				},
				{
					name: "Go-to-Page",
					value: `Click the page number button (${i + 1} / 10) to jump to a specific page!`,
					inline: false
				}
			]

			return {
				embeds: [embed]
			}
		})

		const paginator = new Paginator(pages, {
			client: interaction.client,
			userId: interaction.user?.id // Restrict to the user who ran the command
		})

		await paginator.send(interaction)
	}
}
