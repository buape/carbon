import { ButtonStyle, MessageFlags } from "discord-api-types/v10"
import type { Client } from "../../classes/Client.js"
import { Button } from "../../classes/components/Button.js"
import { Row } from "../../classes/components/Row.js"
import type { ButtonInteraction } from "../../internals/ButtonInteraction.js"
import type { CommandInteraction } from "../../internals/CommandInteraction.js"
import type { ModalInteraction } from "../../internals/ModalInteraction.js"
import type { ComponentData, MessagePayloadObject } from "../../types/index.js"
import { GoToPageModal } from "./GoToPageModal.js"

export class Paginator {
	readonly pages: MessagePayloadObject[]
	readonly id: string
	protected currentPage = 0
	private timeout: NodeJS.Timeout | null = null
	private readonly timeoutDuration: number

	/**
	 * The user ID who is allowed to interact with the paginator
	 */
	readonly userId?: string

	constructor(
		/**
		 * The pages to display in the paginator, with no limit on the amount of pages
		 */
		pages: typeof this.pages,
		{
			/**
			 * The client to use for the paginator
			 */
			client,
			/**
			 * How long in milliseconds the paginator will wait before disabling the buttons
			 * @default 300000 (5 minutes)
			 */
			timeoutDuration = 300000,
			/**
			 * The user ID who is allowed to interact with the paginator
			 */
			userId
		}: { client: Client; timeoutDuration?: number; userId?: string }
	) {
		if (pages.length === 0) {
			throw new Error("Paginator must have at least one page")
		}
		this.pages = pages
		this.timeoutDuration = timeoutDuration
		this.userId = userId
		const timestamp = Date.now().toString(36)
		const random = Math.random().toString(36).slice(2, 5)
		this.id = `${timestamp}-${random}`
		client.paginators.push(this)
		this.startTimeout()
	}

	private startTimeout() {
		if (this.timeout) {
			clearTimeout(this.timeout)
		}
		this.timeout = setTimeout(() => {
			this.disableButtons()
		}, this.timeoutDuration)
	}

	private disableButtons() {
		const page = this.getCurrentPage()
		if (!page.components) return

		const row = this.createNavigationButtons()
		for (const component of row.components) {
			if ("disabled" in component) {
				component.disabled = true
			}
		}

		const otherComponents = page.components.slice(0, -1)
		page.components = [...otherComponents, row]
	}

	public destroy() {
		if (this.timeout) {
			clearTimeout(this.timeout)
			this.timeout = null
		}
	}

	private getCurrentPage(): MessagePayloadObject {
		const page = this.pages[this.currentPage]
		if (!page) throw new Error("Invalid page index")
		return page
	}

	public async goToPage(pageIndex: number, interaction: ButtonInteraction) {
		if (pageIndex < 0 || pageIndex >= this.pages.length) {
			return interaction.reply({
				content: "Invalid page number"
			})
		}
		this.currentPage = pageIndex
		this.startTimeout()
		await interaction.update(this.getCurrentPageWithButtons())
	}

	public async goToPageFromModal(
		pageIndex: number,
		interaction: ModalInteraction
	) {
		if (pageIndex < 0 || pageIndex >= this.pages.length) {
			return interaction.reply({
				content: "Invalid page number",
				flags: MessageFlags.Ephemeral
			})
		}
		this.currentPage = pageIndex
		this.startTimeout()
		await interaction.update(this.getCurrentPageWithButtons())
	}

	private createNavigationButtons(disabled = false): Row<Button> {
		const backButton = new DirectionButton({
			paginatorId: this.id,
			goToPage: this.currentPage - 1,
			disabled: disabled || this.currentPage === 0,
			label: "Back"
		})

		const pageNumber = new PageNumberButton(
			this.id,
			this.currentPage,
			this.pages.length,
			disabled
		)

		const nextButton = new DirectionButton({
			paginatorId: this.id,
			goToPage: this.currentPage + 1,
			disabled: disabled || this.currentPage === this.pages.length - 1,
			label: "Next"
		})

		return new Row([backButton, pageNumber, nextButton])
	}

	private getCurrentPageWithButtons(): MessagePayloadObject {
		const page = this.getCurrentPage()
		return {
			...page,
			components: [...(page.components || []), this.createNavigationButtons()]
		}
	}

	public getInitialPage(): MessagePayloadObject {
		return this.getCurrentPageWithButtons()
	}

	/**
	 * Sends the paginator message using the provided interaction
	 * @param interaction The interaction to use for sending the message
	 */
	public async send(interaction: CommandInteraction) {
		await interaction.reply(this.getInitialPage())
	}
}

class DirectionButton extends Button {
	label: string
	customId: string
	style = ButtonStyle.Secondary
	disabled = false

	constructor({
		paginatorId,
		goToPage,
		disabled,
		label
	}: {
		paginatorId: string
		goToPage: number
		disabled: boolean
		label: string
	}) {
		super()
		this.customId = `paginator:paginatorId=${paginatorId};goToPage=${goToPage}`
		this.label = label
		this.disabled = disabled
	}

	async run(interaction: ButtonInteraction, data: ComponentData) {
		const paginatorId = data.paginatorId
		const goToPage = Number.parseInt(`${data.goToPage}`, 10)
		const paginator = interaction.client.paginators.find(
			(p) => p.id === paginatorId
		)
		if (!paginator)
			return interaction.reply({
				content: `Paginator ${paginatorId} not found in memory`
			})
		if (paginator.userId && paginator.userId !== interaction.user?.id)
			return interaction.acknowledge()
		await paginator.goToPage(goToPage, interaction)
	}
}

class PageNumberButton extends Button {
	label: string
	customId: string
	style = ButtonStyle.Secondary
	disabled: boolean

	constructor(
		paginatorId: string,
		currentPage: number,
		totalPages: number,
		disabled: boolean
	) {
		super()
		this.label = `${currentPage + 1} / ${totalPages}`
		this.customId = `paginator-page:id=${paginatorId};max=${totalPages}`
		this.disabled = disabled || totalPages <= 1
	}

	async run(interaction: ButtonInteraction, data: ComponentData) {
		const paginatorId = data.id as string
		const maxPages = data.max as number
		const paginator = interaction.client.paginators.find(
			(p) => p.id === paginatorId
		)
		if (!paginator)
			return interaction.reply({
				content: "Paginator not found in memory",
				flags: MessageFlags.Ephemeral
			})
		if (paginator.userId && paginator.userId !== interaction.user?.id)
			return interaction.acknowledge()

		const modal = new GoToPageModal(paginatorId, maxPages)
		await interaction.showModal(modal)
	}
}
