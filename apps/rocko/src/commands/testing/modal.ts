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
		console.log(JSON.stringify(modal.serialize(), null, 2))
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
		const name = interaction.fields.getText("name")
		const age = interaction.fields.getText("age")
		const color = interaction.fields.getText("color")
		const height = interaction.fields.getText("height") || "not specified"
		await interaction.reply(
			`Hi ${name}, you are ${age} years old, and your favorite color is ${color}. You are ${height} tall.`
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
