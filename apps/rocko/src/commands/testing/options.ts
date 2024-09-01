import {
	ApplicationCommandOptionType,
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
		}
	]

	async run(interaction: CommandInteraction) {
		interaction.reply({
			content: `Errors: ${interaction.options?.errors}\nStr: ${interaction.options?.getString("str")}\nInt: ${interaction.options?.getInteger("int")}\nNum: ${interaction.options?.getNumber("num")}\nBool: ${interaction.options?.getBoolean("bool")}\nUser: ${interaction.options?.getUser("user")}\nChannel: ${interaction.options?.getChannel("channel")}\nRole: ${interaction.options?.getRole("role")}\nMentionable: ${interaction.options?.getMentionable("mentionable")}`
		})
	}
}
