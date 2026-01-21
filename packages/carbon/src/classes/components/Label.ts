import { type APILabelComponent, ComponentType } from "discord-api-types/v10"
import type { AnySelectMenu } from "../../abstracts/AnySelectMenu.js"
import { BaseModalComponent } from "../../abstracts/BaseModalComponent.js"
import type { Checkbox } from "./Checkbox.js"
import type { CheckboxGroup } from "./CheckboxGroup.js"
import type { FileUpload } from "./FileUpload.js"
import type { RadioGroup } from "./RadioGroup.js"
import type { TextInput } from "./TextInput.js"

export abstract class Label extends BaseModalComponent {
	readonly type = ComponentType.Label

	/**
	 * The label text
	 */
	abstract label: string

	/**
	 * The description of the label (optional)
	 */
	description?: string

	/**
	 * The component within this label
	 */
	component?:
		| TextInput
		| AnySelectMenu
		| FileUpload
		| Checkbox
		| CheckboxGroup
		| RadioGroup

	/**
	 * The custom ID of the label - required by BaseModalComponent
	 */
	customId = "label"

	constructor(
		component?:
			| TextInput
			| AnySelectMenu
			| FileUpload
			| Checkbox
			| CheckboxGroup
			| RadioGroup
	) {
		super()
		if (component) {
			this.component = component
		}
	}

	serialize = (): APILabelComponent => {
		if (!this.component) {
			throw new Error(
				"Label must have a component, either assign it ahead of time or pass it to the constructor"
			)
		}
		return {
			type: this.type,
			label: this.label,
			description: this.description,
			component: this.component.serialize()
		}
	}
}
