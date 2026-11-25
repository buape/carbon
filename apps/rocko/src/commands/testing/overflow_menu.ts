import {
	ApplicationCommandOptionType,
	Command,
	type CommandInteraction,
	type CommandOptions,
	LinkMenuActionItem,
	MenuActionItem,
	type MenuActionItemInteraction,
	MenuActionItemStyle,
	OverflowMenu,
	Row,
	Section,
	TextDisplay
} from "@buape/carbon"

class DefaultAction extends MenuActionItem {
	customId = "overflow-default"
	label = "Default action"
	description = "Reply with the name of the selected action"
	emoji = { name: "👋" }

	async run(interaction: MenuActionItemInteraction) {
		await interaction.reply({
			content: `You clicked "${this.label}".`,
			ephemeral: true
		})
	}
}

class DangerAction extends DefaultAction {
	customId = "overflow-danger"
	label = "Danger action"
	description = "A danger-style action"
	style = MenuActionItemStyle.Danger
}

class DocsAction extends LinkMenuActionItem {
	label = "Carbon Documentation"
	url = "https://carbon.buape.com"
}

export default class OverflowMenuCommand extends Command {
	name = "overflow-menu"
	description = "Test grouped overflow menus in rows and section accessories"
	components = [new DefaultAction(), new DangerAction()]

	options = [
		{
			name: "section",
			type: ApplicationCommandOptionType.Boolean,
			description: "Use a section accessory instead of an action row"
		}
	] satisfies CommandOptions

	async run(interaction: CommandInteraction) {
		const menu = new OverflowMenu([
			{
				label: "Actions",
				components: [new DefaultAction(), new DangerAction()]
			},
			{ components: [new DocsAction()] }
		])
		const text = new TextDisplay(
			"Open the menu to see default danger and link actions"
		)

		await interaction.reply({
			components: interaction.options.getBoolean("section")
				? [new Section([text], menu)]
				: [text, new Row([menu])],
			ephemeral: true
		})
	}
}
