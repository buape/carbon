import type { APIModalSubmitInteraction } from "discord-api-types/v10"
import { Base } from "../abstracts/Base.js"
import type { Modal } from "../classes/Modal.js"
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
		}
	}
	/**
	 * Handle an interaction
	 * @internal
	 */
	async handleInteraction(data: APIModalSubmitInteraction) {
		const modal = this.modals.find((x) => x.customId === data.data.custom_id)
		if (!modal) return false

		modal.run(new ModalInteraction(this.client, data, {}))
	}
}
