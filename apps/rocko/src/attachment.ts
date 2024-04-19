import { readFileSync } from "node:fs"
import { Command, type CommandInteraction } from "@buape/carbon"

export class Attachment extends Command {
	name = "attachment"
	description = "Attachment test"
	defer = true

	async run(interaction: CommandInteraction) {
		const file = new Blob([readFileSync("./kiai.png")])
		interaction.reply(
			{
				content: "Testing"
			},
			{
				files: [
					{
						name: "kiai.png",
						data: file
					}
				]
			}
		)
	}
}
