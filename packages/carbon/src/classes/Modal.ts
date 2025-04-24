import type {
	APIActionRowComponent,
	APIModalInteractionResponseCallbackData,
	APITextInputComponent
} from "discord-api-types/v10"
import type { BaseModalComponent } from "../abstracts/BaseModalComponent.js"
import type { ModalInteraction } from "../internals/ModalInteraction.js"
import type { Row } from "./components/Row.js"

export abstract class Modal {
	/**
	 * The title of the modal
	 */
	abstract title: string

	/**
	 * The components of the modal
	 */
	components: Row<BaseModalComponent>[] = []

	/**
	 * The custom ID of the modal
	 */
	abstract customId: string

	abstract run(interaction: ModalInteraction): Promise<void>

	serialize = (): APIModalInteractionResponseCallbackData => {
		return {
			title: this.title,
			custom_id: this.customId,
			components: this.components.map(
				(row) =>
					row.serialize() as unknown as APIActionRowComponent<APITextInputComponent>
			)
		}
	}
}
