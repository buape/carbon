import { MessageFlags, TextInputStyle } from "discord-api-types/v10"
import { Modal } from "../../classes/Modal.js"
import { Label } from "../../classes/components/Label.js"
import { TextInput } from "../../classes/components/TextInput.js"
import type { ModalInteraction } from "../../internals/ModalInteraction.js"
import type { ComponentData } from "../../types/index.js"

export class GoToPageModal extends Modal {
	title = "Go to Page"
	customId: string

	components = [new PageNumberLabel()]

	constructor(paginatorId: string, maxPages: number) {
		super()
		this.customId = `paginator-goto:id=${paginatorId};max=${maxPages}`
	}

	async run(interaction: ModalInteraction, data: ComponentData) {
		const pageInput = interaction.fields.getText("page", true)
		const pageNumber = Number.parseInt(pageInput)
		const paginatorId = data.id as string
		const maxPages = data.max as number

		// Validate page number
		if (Number.isNaN(pageNumber) || pageNumber < 1 || pageNumber > maxPages) {
			return interaction.reply({
				content: `Please enter a valid page number between 1 and ${maxPages}.`,
				flags: MessageFlags.Ephemeral
			})
		}

		// Find the paginator and navigate to the page
		const paginator = interaction.client.paginators.find(
			(p) => p.id === paginatorId
		)
		if (!paginator) {
			return interaction.reply({
				content: "Paginator not found in memory.",
				flags: MessageFlags.Ephemeral
			})
		}

		// Check if user is authorized to use this paginator
		if (paginator.userId && paginator.userId !== interaction.user?.id) {
			return interaction.acknowledge()
		}

		// Convert to 0-based index and navigate
		await paginator.goToPageFromModal(pageNumber - 1, interaction)
	}
}

class PageNumberLabel extends Label {
	label = "Page Number"
	description = "Enter the page number you want to go to"

	constructor() {
		super(new PageNumberInput())
	}
}

class PageNumberInput extends TextInput {
	customId = "page"
	style = TextInputStyle.Short
	placeholder = "Enter page number..."
	minLength = 1
	maxLength = 10
	required = true
}
