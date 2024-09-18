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
	// Set the name and description of the command
	name = "button"
	description = "A simple command with a button!"

	// Make the command automatically defer
	defer = true

	// Mount the components that are runnable here
	components = [PingButton]

	// Run the command
	async run(interaction: CommandInteraction) {
		await interaction.reply({
			content: "Look at this button!",
			components: [new Row([new PingButton(), new Link()])]
		})
	}
}

// Create a button that will respond when you click on it
class PingButton extends Button {
	customId = "click-me"
	label = "Click me!"
	// @ts-expect-error 2416 
	style = ButtonStyle.Primary

	async run(interaction: ButtonInteraction) {
		await interaction.reply({ content: "You clicked the button!" })
	}
}

// Create a button that will show a link to the Carbon website
class Link extends LinkButton {
	label = "Carbon Website"
	url = "https://carbon.buape.com"
}