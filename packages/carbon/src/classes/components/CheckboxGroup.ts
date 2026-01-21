import {
	type APICheckboxGroupActionComponent,
	ComponentType
} from "discord-api-types/v10"
import { BaseModalComponent } from "../../abstracts/BaseModalComponent.js"

export abstract class CheckboxGroup extends BaseModalComponent {
	readonly type = ComponentType.CheckboxGroup as const

	abstract customId: string

	/**
	 * The options in the checkbox group
	 */
	options: APICheckboxGroupActionComponent["options"] = []

	/**
	 * Whether the checkbox group is required
	 */
	required?: boolean

	/**
	 * The minimum number of options that must be selected
	 */
	minValues?: number

	/**
	 * The maximum number of options that can be selected
	 */
	maxValues?: number

	serialize = (): APICheckboxGroupActionComponent => {
		const data: APICheckboxGroupActionComponent = {
			type: this.type,
			custom_id: this.customId,
			options: this.options
		}
		if (this.id !== undefined) data.id = this.id
		if (this.minValues !== undefined) data.min_values = this.minValues
		if (this.maxValues !== undefined) data.max_values = this.maxValues
		if (this.required !== undefined) data.required = this.required
		return data
	}
}
