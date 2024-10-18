import {
	Button,
	type ButtonInteraction,
	ButtonStyle,
	Command,
	type CommandInteraction,
	LinkButton,
	Row
} from "@buape/carbon"

export default class ButtonCommand extends Command {
	name = "button"
	description = "A simple command with a button!"
	defer = true

	components = [ClickMeButton]

	async run(interaction: CommandInteraction) {
		await interaction.reply({
			content: "Look at this button!",
			components: [new Row([new ClickMeButton(), new DocsButton()])]
		})
	}
}

class ClickMeButton extends Button {
	customId = "click-me"
	label = "Click me!"
	style = ButtonStyle.Primary

	async run(interaction: ButtonInteraction) {
		await interaction.reply("You clicked the button!")
	}
}

class DocsButton extends LinkButton {
	label = "Carbon Documentation"
	url = "https://carbon.buape.com"
}
