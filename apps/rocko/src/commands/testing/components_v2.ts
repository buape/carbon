import {
	Button,
	type ButtonInteraction,
	ButtonStyle,
	Command,
	type CommandInteraction,
	CommandWithSubcommands,
	Container,
	MediaGallery,
	Row,
	Section,
	Separator,
	TextDisplay,
	Thumbnail
} from "@buape/carbon"

class Main extends Command {
	name = "main"
	description = "Test the main component v2 setup"

	async run(interaction: CommandInteraction) {
		const components = buildComponents()
		await interaction.reply({
			components
		})
	}
}

class ContainerCommand extends Command {
	name = "container"
	description = "Test the container component"

	async run(interaction: CommandInteraction) {
		const components = buildComponents()
		await interaction.reply({
			components: [new Container(components, "#FF0000")]
		})
	}
}

class ButtonOne extends Button {
	customId = "components-v2-button1"
	label = "Click me!"
	style = ButtonStyle.Primary

	async run(interaction: ButtonInteraction) {
		await interaction.reply("You clicked the button!")
	}
}

class ButtonTwo extends Button {
	customId = "components-v2-button2"
	label = "Click me! (container row)"
	style = ButtonStyle.Primary

	async run(interaction: ButtonInteraction) {
		await interaction.reply("You clicked the button!")
	}
}

const buildComponents = () => {
	const gallery = new MediaGallery([
		{ url: "https://cdn.buape.com/carbon/logo.png" },
		{ url: "https://cdn.buape.com/buape_circle.png" },
		{ url: "https://cdn.buape.com/kiai/logo.png" }
	])

	return [
		new Section(
			[
				new TextDisplay(
					"This is the first text component, there's a button attached!"
				)
			],
			new ButtonOne()
		),
		new Section(
			[
				new TextDisplay(
					"This is the second text component, thumbnail for this one :D"
				)
			],
			new Thumbnail("https://cdn.buape.com/carbon/logo.png")
		),
		new TextDisplay(
			"This is the third text component, no section for this one!"
		),
		new Separator({ spacing: "large" }),
		new TextDisplay("Gallery:"),
		gallery,
		new Row([new ButtonTwo()])
	]
}

export default class ComponentsV2 extends CommandWithSubcommands {
	name = "components-v2"
	description = "Test the new components"

	subcommands = [new Main(), new ContainerCommand()]
}
