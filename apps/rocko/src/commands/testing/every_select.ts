import {
	ChannelSelectMenu,
	type ChannelSelectMenuInteraction,
	Command,
	type CommandInteraction,
	MentionableSelectMenu,
	type MentionableSelectMenuInteraction,
	RoleSelectMenu,
	type RoleSelectMenuInteraction,
	Row,
	StringSelectMenu,
	type StringSelectMenuInteraction,
	UserSelectMenu,
	type UserSelectMenuInteraction
} from "@buape/carbon"

export default class SelectCommand extends Command {
	name = "every_select"
	description = "Send every select menu"
	defer = true
	components = [
		new StringSelect(),
		new RoleSelect(),
		new MentionableSelect(),
		new ChannelSelect(),
		new UserSelect()
	]

	async run(interaction: CommandInteraction) {
		interaction.reply({
			content: "Select menus! <:caughtIn4k:1145473115703496816>",
			components: [
				new Row([new StringSelect()]),
				new Row([new RoleSelect()]),
				new Row([new MentionableSelect()]),
				new Row([new ChannelSelect()]),
				new Row([new UserSelect()])
			]
		})
	}
}

class StringSelect extends StringSelectMenu {
	customId = "string-select"
	placeholder = "String select menu"
	options = [{ label: "Option 1", value: "option1" }]
	async run(interaction: StringSelectMenuInteraction) {
		interaction.reply({ content: interaction.values.join(", ") })
	}
}

class RoleSelect extends RoleSelectMenu {
	customId = "role-select"
	placeholder = "Role select menu"
	async run(interaction: RoleSelectMenuInteraction) {
		interaction.reply({ content: interaction.values.join(", ") })
	}
}
class MentionableSelect extends MentionableSelectMenu {
	customId = "mentionable-select"
	placeholder = "Mentionable select menu"
	async run(interaction: MentionableSelectMenuInteraction) {
		interaction.reply({ content: interaction.values.join(", ") })
	}
}
class ChannelSelect extends ChannelSelectMenu {
	customId = "channel-select"
	placeholder = "Channel select menu"
	async run(interaction: ChannelSelectMenuInteraction) {
		interaction.reply({ content: interaction.values.join(", ") })
	}
}
class UserSelect extends UserSelectMenu {
	customId = "user-select"
	placeholder = "User select menu"
	async run(interaction: UserSelectMenuInteraction) {
		interaction.reply({ content: interaction.values.join(", ") })
	}
}
