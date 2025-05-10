import { Command, type CommandInteraction, Embed } from "@buape/carbon"
import { Paginator } from "@buape/carbon/paginator"

export default class PaginatorCommand extends Command {
	name = "paginator"
	description = "Test the paginator functionality"

	async run(interaction: CommandInteraction) {
		const pages = [
			{
				embeds: [
					new Embed({
						title: "Page 1",
						description: "This is the first page of the paginator test.",
						color: 0x00ff00
					})
				]
			},
			{
				embeds: [
					new Embed({
						title: "Page 2",
						description: "This is the second page of the paginator test.",
						color: 0xff0000
					})
				]
			},
			{
				embeds: [
					new Embed({
						title: "Page 3",
						description: "This is the third page of the paginator test.",
						color: 0x0000ff
					})
				]
			}
		]

		const paginator = new Paginator(pages, { client: interaction.client })
		await paginator.send(interaction)
	}
}
