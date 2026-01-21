import {
	Checkbox,
	CheckboxGroup,
	Command,
	type CommandInteraction,
	Label,
	Modal,
	type ModalInteraction,
	RadioGroup,
	TextDisplay
} from "@buape/carbon"

export default class ModalCommand extends Command {
	name = "modal4"
	description = "Modal test with checkbox and radio components"

	async run(interaction: CommandInteraction) {
		const modal = new TestModal()
		await interaction.showModal(modal)
	}
}

class TestModal extends Modal {
	title = "Test Modal 4"
	customId = "test-modal"

	components = [
		new IntroTextDisplay(),
		new CheckboxGroupLabel(),
		new RadioGroupLabel(),
		new NewsletterCheckboxLabel()
	]

	async run(interaction: ModalInteraction) {
		const group = interaction.fields.getStringSelect("checkbox-group", true)
		const radio = interaction.fields.getStringSelect("radio-group", true)
		const singleCheckbox =
			interaction.fields.getStringSelect("single-checkbox") ?? []
		const checkboxState = singleCheckbox.length ? "checked" : "unchecked"

		await interaction.reply(
			`You selected:\n- Checkbox Group: ${group.join(", ")}\n- Radio Group: ${radio.join(", ")}\n- Single Checkbox: ${checkboxState}`
		)
	}
}

class IntroTextDisplay extends TextDisplay {
	constructor() {
		super("Test the new checkbox and radio modal components.")
	}
}

class CheckboxGroupLabel extends Label {
	label = "Pick your favorite snacks"
	description = "Choose one or more snacks"

	constructor() {
		super(
			new (class extends CheckboxGroup {
				customId = "checkbox-group"
				required = true
				minValues = 1
				maxValues = 3
				options = [
					{ label: "Chips", value: "chips" },
					{ label: "Cookies", value: "cookies" },
					{ label: "Popcorn", value: "popcorn" }
				]
			})()
		)
	}
}

class RadioGroupLabel extends Label {
	label = "Pick a size"
	description = "Choose one size"

	constructor() {
		super(
			new (class extends RadioGroup {
				customId = "radio-group"
				required = true
				options = [
					{ label: "Small", value: "small" },
					{ label: "Medium", value: "medium" },
					{ label: "Large", value: "large" }
				]
			})()
		)
	}
}

class NewsletterCheckboxLabel extends Label {
	label = "Join the newsletter"
	description = "Opt in to updates"

	constructor() {
		super(
			new (class extends Checkbox {
				customId = "single-checkbox"
				default = false
			})()
		)
	}
}
