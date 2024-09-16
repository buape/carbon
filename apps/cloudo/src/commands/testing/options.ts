import {
	type APIApplicationCommandBasicOption,
	ApplicationCommandOptionType,
	Command,
	type CommandInteraction
} from "@buape/carbon"

export default class Options extends Command {
	name = "options"
	description = "Options test"
	defer = true

	options: APIApplicationCommandBasicOption[] = [
		{
			name: "str",
			type: ApplicationCommandOptionType.String,
			description: "DESCRIPTION",
			required: true
		}
	]

	async run(interaction: CommandInteraction) {
		interaction.reply({
			content: `${interaction.options.getString("str")}`
		})
	}
}
