import {
	ApplicationCommandOptionType,
	type AutocompleteInteraction,
	Command,
	type CommandInteraction,
	type CommandOptions
} from "@buape/carbon"

export default class OptionsCommand extends Command {
	name = "options"
	description = "Options test"
	defer = true

	options: CommandOptions = [
		{
			name: "str",
			type: ApplicationCommandOptionType.String,
			description: "DESCRIPTION",
			required: false
		},
		{
			name: "int",
			type: ApplicationCommandOptionType.Integer,
			description: "DESCRIPTION",
			required: false
		},
		{
			name: "num",
			type: ApplicationCommandOptionType.Number,
			description: "DESCRIPTION",
			required: false
		},
		{
			name: "bool",
			type: ApplicationCommandOptionType.Boolean,
			description: "DESCRIPTION",
			required: false
		},
		{
			name: "user",
			type: ApplicationCommandOptionType.User,
			description: "DESCRIPTION",
			required: false
		},
		{
			name: "channel",
			type: ApplicationCommandOptionType.Channel,
			description: "DESCRIPTION",
			required: false
		},
		{
			name: "role",
			type: ApplicationCommandOptionType.Role,
			description: "DESCRIPTION",
			required: false
		},
		{
			name: "mentionable",
			type: ApplicationCommandOptionType.Mentionable,
			description: "DESCRIPTION",
			required: false
		},
		{
			name: "autocomplete",
			type: ApplicationCommandOptionType.String,
			description: "DESCRIPTION",
			required: false,
			autocomplete: true
		}
	]

	async autocomplete(interaction: AutocompleteInteraction) {
		await interaction.respond([
			{
				name: "That thing you said",
				value: String(interaction.options.getFocused()) || "No focused option"
			},
			{
				name: "That thing you said but with a prefix",
				value: `Prefix: ${String(interaction.options.getFocused())}`
			}
		])
	}

	async run(interaction: CommandInteraction) {
		const str = interaction.options.getString("str")
		const int = interaction.options.getInteger("int")
		const num = interaction.options.getNumber("num")
		const bool = interaction.options.getBoolean("bool")
		const user = interaction.options.getUser("user")
		const channel = await interaction.options.getChannel("channel")
		const role = interaction.options.getRole("role")
		const mentionable = await interaction.options.getMentionable("mentionable")

		await interaction.reply(
			`You provided the following options:\n str: ${str}\n int: ${int}\n num: ${num}\n bool: ${bool}\n user: ${user?.id}\n channel: ${channel?.id}\n role: ${role?.id}\n mentionable: ${mentionable?.id}`
		)
	}
}
