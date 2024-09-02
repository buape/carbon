import {
	ApplicationCommandType,
	Command,
	type CommandInteraction
} from "@buape/carbon"

export default class MessageCommand extends Command {
	name = "Message Command"
	description = "Message command test"
	defer = true
	type = ApplicationCommandType.Message

	async run(interaction: CommandInteraction) {
		interaction.reply({ content: "Message command" })
	}
}
