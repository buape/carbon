// ComponentType import removed as we define COMPONENT_TYPE_LABEL locally
import { BaseModalComponent } from "../../abstracts/BaseModalComponent.js"
import type { ModalStringSelectMenu } from "./ModalStringSelectMenu.js"
import type { TextInput } from "./TextInput.js"

interface APILabelComponent {
	type: 18
	label: string
	description?: string
	component: unknown
}

export abstract class Label extends BaseModalComponent {
	// TODO: Remove this once discord-api-types is updated
	// @ts-expect-error - Label component type not yet in discord-api-types
	readonly type = 18
	readonly isV2 = false

	/**
	 * The label text
	 */
	abstract label: string

	/**
	 * The description of the label (optional)
	 */
	description?: string

	/**
	 * The component within this label (TextInput or ModalStringSelectMenu)
	 */
	component: TextInput | ModalStringSelectMenu

	/**
	 * The custom ID of the label - required by BaseModalComponent
	 */
	customId = "label"

	constructor(component: TextInput | ModalStringSelectMenu) {
		super()
		this.component = component
	}

	// TODO: Remove this once discord-api-types is updated
	// @ts-expect-error - Label component type not yet in discord-api-types
	serialize = (): APILabelComponent => {
		return {
			type: 18,
			label: this.label,
			description: this.description,
			component: this.component.serialize()
		}
	}
}
