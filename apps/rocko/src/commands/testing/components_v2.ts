import { readFileSync } from "node:fs"
import {
	Button,
	type ButtonInteraction,
	ButtonStyle,
	Command,
	type CommandInteraction,
	CommandWithSubcommands,
	Container,
	File,
	MediaGallery,
	Row,
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
		const gallery = new MediaGallery([
			{ url: "attachment://kiai.png" },
			{ url: "https://cdn.buape.com/carbon/logo.png" },
			{ url: "https://cdn.buape.com/buape_circle.png" }
		])
		const components = [
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
			new TextDisplay("File:"),
			new File("attachment://kiai.png"),
			new File("attachment://kiai.png", true),
			new TextDisplay("Gallery:"),
			gallery,
			new Row([new ButtonTwo()])
		]
		await interaction.reply({
			components,
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
		const gallery = new MediaGallery([
			{ url: "attachment://kiai.png" },
			{ url: "https://cdn.buape.com/carbon/logo.png" },
			{ url: "https://cdn.buape.com/buape_circle.png" }
		])
		const components = [
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
			new TextDisplay("File:"),
			new File("attachment://kiai.png"),
			new File("attachment://kiai.png", true),
			new TextDisplay("Gallery:"),
			gallery,
			new Row([new ButtonTwo()])
		]
		await interaction.reply({
			components: [new Container(components, "#FF0000")],
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
	customId = "componentsv2-button1"
	label = "Click me!"
	style = ButtonStyle.Primary

	async run(interaction: ButtonInteraction) {
		await interaction.reply("You clicked the button!")
	}
}

class ButtonTwo extends Button {
	customId = "componentsv2-button2"
	label = "Click me! (container row)"
	style = ButtonStyle.Primary

	async run(interaction: ButtonInteraction) {
		await interaction.reply("You clicked the button!")
	}
}
