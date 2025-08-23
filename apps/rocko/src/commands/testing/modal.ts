import {
	Command,
	type CommandInteraction,
	Label,
	Modal,
	type ModalInteraction,
	ModalStringSelectMenu,
	TextInput,
	TextInputStyle
} from "@buape/carbon"

export default class ModalCommand extends Command {
	name = "modal"
	description = "Modal test"

	async run(interaction: CommandInteraction) {
		const modal = new TestModal()
		await interaction.showModal(modal)
	}
}

class TestModal extends Modal {
	title = "Test Modal"
	customId = "test-modal"

	components = [
		new GreetingLabel(),
		new NameLabel(),
		new AgeLabel(),
		new PreferencesLabel(),
		new OptionalInfoLabel()
	]

	async run(interaction: ModalInteraction) {
		const doing = interaction.fields.getText("hi", true)
		const name = interaction.fields.getText("name", true)
		const age = interaction.fields.getText("age", true)
		const color = interaction.fields.getStringSelect("color", true)
		const height = interaction.fields.getText("height") || "not specified"
		await interaction.reply(
			`Hi ${name}, I'm so glad you are ${doing}! You are ${age} years old, and your favorite color ${color.length > 1 ? "are" : "is"} ${color.join(", ")}. You are ${height} tall.`
		)
	}
}

class GreetingLabel extends Label {
	label = "Greeting"
	description = "Tell us how you're doing"

	constructor() {
		super(
			new (class extends TextInput {
				customId = "hi"
				style = TextInputStyle.Paragraph
				required = true
				placeholder = "How are you doing today?"
			})()
		)
	}
}

class NameLabel extends Label {
	label = "Name"
	description = "Your full name"

	constructor() {
		super(
			new (class extends TextInput {
				customId = "name"
				required = true
				placeholder = "Enter your full name"
			})()
		)
	}
}

class AgeLabel extends Label {
	label = "Age"
	description = "How old are you?"

	constructor() {
		super(
			new (class extends TextInput {
				customId = "age"
				required = true
				placeholder = "Enter your age"
			})()
		)
	}
}

class PreferencesLabel extends Label {
	label = "Favorite Color"
	description = "What's your favorite color?"

	constructor() {
		super(
			new (class extends ModalStringSelectMenu {
				customId = "color"
				required = true
				maxValues = 3
				minValues = 1
				options = [
					{
						label: "Blue",
						value: "blue"
					},
					{
						label: "Red",
						value: "red"
					},
					{
						label: "Green",
						value: "green"
					},
					{
						label: "Yellow",
						value: "yellow"
					},
					{
						label: "Orange",
						value: "orange"
					},
					{
						label: "Purple",
						value: "purple"
					},
					{
						label: "Pink",
						value: "pink"
					},
					{
						label: "Brown",
						value: "brown"
					},
					{
						label: "Black",
						value: "black"
					},
					{
						label: "White",
						value: "white"
					}
				]
			})()
		)
	}
}

class OptionalInfoLabel extends Label {
	label = "Height (Optional)"
	description = "How tall are you?"

	constructor() {
		super(
			new (class extends TextInput {
				customId = "height"
				placeholder = "e.g. 5'10\", 180cm"
				required = false
			})()
		)
	}
}
