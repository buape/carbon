import type { APIModalSubmitInteraction } from "discord-api-types/v10"
import { Base } from "../abstracts/Base.js"
import type { Modal } from "../classes/Modal.js"
import { defaultLogger } from "../utils/logger.js"
import { ModalInteraction } from "./ModalInteraction.js"

export class ModalHandler extends Base {
	modals: Modal[] = []
	/**
	 * Register a modal with the handler
	 * @internal
	 */
	registerModal(modal: Modal) {
		if (!this.modals.find((x) => x.customId === modal.customId)) {
			this.modals.push(modal)
			this.client.options?.testHooks?.emit?.({
				type: "modal:registered",
				customId: modal.customId
			})
		}
	}
	/**
	 * Handle an interaction
	 * @internal
	 */
	async handleInteraction(data: APIModalSubmitInteraction) {
		return this.client.instrumentation
			? await this.client.instrumentation.run(
					"discord.interaction.modal",
					{},
					() => this.handleInteractionInternal(data)
				)
			: await this.handleInteractionInternal(data)
	}

	private async handleInteractionInternal(data: APIModalSubmitInteraction) {
		try {
			let modal = this.modals.find((x) => {
				const modalKey = x.customIdParser(x.customId).key
				const interactionKey = x.customIdParser(data.data.custom_id).key
				return modalKey === interactionKey
			})

			if (!modal) {
				modal = this.modals.find((x) => {
					const modalKey = x.customIdParser(x.customId).key
					return modalKey === "*"
				})
			}

			if (!modal) return false

			const interaction = new ModalInteraction(this.client, data, {})
			const parsed = modal.customIdParser(data.data.custom_id)
			if ((await modal.preCheck(interaction, parsed.data)) !== true)
				return false

			return await modal.run(interaction, parsed.data)
		} catch (error: unknown) {
			this.client.instrumentation?.emit("carbon.interaction.handler.error", {
				handler: "modal"
			})
			this.client.options?.testHooks?.emit?.({
				type: "handler:error",
				handler: "modal",
				error
			})
			if (this.client.options?.testHooks?.throwHandlerErrors === false) {
				;(this.client.logger ?? defaultLogger).error(error)
				return
			}
			throw error
		}
	}
}
