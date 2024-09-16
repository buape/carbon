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

	components = [PingButton]

	async run(interaction: CommandInteraction) {
		await interaction.reply({
			content: "Pong!",
			components: [new Row([new PingButton(), new Link()])]
		})
	}
}

class PingButton extends Button {
	customId = "ping"
	label = "Ping"
	style = ButtonStyle.Primary

	async run(interaction: ButtonInteraction) {
		await interaction.reply("OMG YOU CLICKED THE BUTTON")
	}
}

class Link extends LinkButton {
	label = "Link"
	url = "https://buape.com"
}
