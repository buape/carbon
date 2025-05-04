import { readFileSync } from "node:fs"
import {
	Button,
	ButtonInteraction,
	ButtonStyle,
	Command,
	type CommandInteraction,
	CommandWithSubcommands,
	Row
} from "@buape/carbon"
import {
	Container,
	File,
	MediaGallery,
	Section,
	Separator,
	TextDisplay,
	Thumbnail
} from "@buape/carbon"

export default class ComponentsV2 extends CommandWithSubcommands {
	name = "components-v2"
	description = "Test the new components"

	subcommands = [new Main(), new ContainerCommand()]
}

class Main extends Command {
	name = "main"
	description = "Test the main component v2 setup"

	async run(interaction: CommandInteraction) {
		const file = new Blob([readFileSync("./kiai.png")])
		await interaction.reply({
			components: componentsToSend,
			files: [
				{
					name: "kiai.png",
					data: file,
					description: "Test image"
				}
			]
		})
	}
}

class ContainerCommand extends Command {
	name = "container"
	description = "Test the container component"

	async run(interaction: CommandInteraction) {
		const file = new Blob([readFileSync("./kiai.png")])
		await interaction.reply({
			components: [new ContainerOne()],
			files: [
				{
					name: "kiai.png",
					data: file,
					description: "Test image"
				}
			]
		})
	}
}

class ButtonOne extends Button {
	customId = "componentsv2-button1";
	label = "Click me!";
	style = ButtonStyle.Primary;

	async run(interaction: ButtonInteraction) {
		await interaction.reply("You clicked the button!");
	}
}

class ButtonTwo extends Button {
	customId = "componentsv2-button2";
	label = "Click me! (container row)";
	style = ButtonStyle.Primary;

	async run(interaction: ButtonInteraction) {
		await interaction.reply("You clicked the button!");
	}
}

class SectionOne extends Section {
	components = [
		new TextDisplay(
			"This is the first text component, there's a button attached!"
		)
	]
	accessory = new ButtonOne()
}

class CarbonThumbnail extends Thumbnail {
	url = "https://cdn.buape.com/CarbonLogo.png"
}

class SectionTwo extends Section {
	components = [
		new TextDisplay(
			"This is the second text component, thumbnail for this one :D"
		)
	]
	accessory = new CarbonThumbnail()
}

class KiaiGallery extends MediaGallery {
	items = [
		{
			url: "attachment://kiai.png"
		},
		{
			url: "https://cdn.buape.com/CarbonLogo.png"
		},
		{
			url: "https://cdn.buape.com/buape_circle.png"
		}
	]
}

const componentsToSend = [
	new SectionOne(),
	new SectionTwo(),
	new TextDisplay("This is the third text component, no section for this one!"),
	new Separator({ spacing: "large" }),
	new TextDisplay("File:"),
	new File("attachment://kiai.png"),
	new File("attachment://kiai.png", true),
	new TextDisplay("Gallery:"),
	new KiaiGallery(),
	new Row([new ButtonTwo()])
]

class ContainerOne extends Container {
	components = componentsToSend

	accentColor = "#FF0000"
}
