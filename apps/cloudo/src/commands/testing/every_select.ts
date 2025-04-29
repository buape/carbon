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

export default class EverySelectCommand extends Command {
	name = "every-select"
	description = "Send every select menu"
	defer = true

	async run(interaction: CommandInteraction) {
		const stringRow = new Row([new StringSelect()])
		const roleRow = new Row([new RoleSelect()])
		const mentionableRow = new Row([new MentionableSelect()])
		const channelRow = new Row([new ChannelSelect()])
		const userRow = new Row([new UserSelect()])

		await interaction.reply({
			content: "Select menus!!",
			components: [stringRow, roleRow, mentionableRow, channelRow, userRow]
		})
	}
}

class StringSelect extends StringSelectMenu {
	customId = "string-select"
	placeholder = "String select menu"
	options = [{ label: "Option 1", value: "option1" }]
	async run(interaction: StringSelectMenuInteraction) {
		await interaction.reply({ content: interaction.values.join(", ") })
	}
}

class RoleSelect extends RoleSelectMenu {
	customId = "role-select"
	placeholder = "Role select menu"
	async run(interaction: RoleSelectMenuInteraction) {
		await interaction.reply({ content: interaction.values.join(", ") })
	}
}
class MentionableSelect extends MentionableSelectMenu {
	customId = "mentionable-select"
	placeholder = "Mentionable select menu"
	async run(interaction: MentionableSelectMenuInteraction) {
		await interaction.reply({ content: interaction.values.join(", ") })
	}
}
class ChannelSelect extends ChannelSelectMenu {
	customId = "channel-select"
	placeholder = "Channel select menu"
	async run(interaction: ChannelSelectMenuInteraction) {
		await interaction.reply({ content: interaction.values.join(", ") })
	}
}
class UserSelect extends UserSelectMenu {
	customId = "user-select"
	placeholder = "User select menu"
	async run(interaction: UserSelectMenuInteraction) {
		await interaction.reply({ content: interaction.values.join(", ") })
	}
}
