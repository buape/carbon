import {
	ApplicationCommandOptionType,
	type AutocompleteInteraction,
	Command,
	type CommandInteraction,
	type CommandOptions
} from "@buape/carbon"

export default class Options extends Command {
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
			name: "attachment",
			type: ApplicationCommandOptionType.Attachment,
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

	async run(interaction: CommandInteraction) {
		await interaction.reply({
			content: `Str: ${interaction.options.getString("str")}\nInt: ${interaction.options.getInteger("int")}\nNum: ${interaction.options.getNumber("num")}\nBool: ${interaction.options.getBoolean("bool")}\nUser: ${interaction.options.getUser("user")}\nChannel: ${interaction.options.getChannel("channel")}\nRole: ${interaction.options.getRole("role")}\nMentionable: ${interaction.options.getMentionable("mentionable")}\nAutocomplete: ${interaction.options.getString("autocomplete")}`
		})
	}

	async autocomplete(interaction: AutocompleteInteraction) {
		await interaction.respond([
			{
				name: "That thing you said",
				value: `${interaction.options.getFocused() || "NONE"}`
			},
			{
				name: "That thing you said but with a 4",
				value: `4: ${interaction.options.getFocused() || "NONE"}`
			}
		])
	}
}
