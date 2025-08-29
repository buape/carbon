import {
	type APILabelComponent,
	type APIStringSelectComponent,
	ComponentType
} from "discord-api-types/v10"
// ComponentType import removed as we define COMPONENT_TYPE_LABEL locally
import { BaseModalComponent } from "../../abstracts/BaseModalComponent.js"
import type { StringSelectMenu } from "./StringSelectMenu.js"
import type { TextInput } from "./TextInput.js"

export abstract class Label extends BaseModalComponent {
	readonly type = ComponentType.Label
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
	 * The component within this label (TextInput or StringSelectMenu)
	 */
	component: TextInput | StringSelectMenu

	/**
	 * The custom ID of the label - required by BaseModalComponent
	 */
	customId = "label"

	constructor(component: TextInput | StringSelectMenu) {
		super()
		this.component = component
	}

	serialize = (): APILabelComponent => {
		return {
			type: this.type,
			label: this.label,
			description: this.description,
			component: this.component.serialize() as APIStringSelectComponent
		}
	}
}
