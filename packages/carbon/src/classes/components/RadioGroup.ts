import {
	type APIRadioGroupActionComponent,
	ComponentType
} from "discord-api-types/v10"
import { BaseModalComponent } from "../../abstracts/BaseModalComponent.js"

export abstract class RadioGroup extends BaseModalComponent {
	readonly type = ComponentType.RadioGroup as const

	abstract customId: string

	/**
	 * The options in the radio group
	 */
	options: APIRadioGroupActionComponent["options"] = []

	/**
	 * Whether the radio group is required
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

	serialize = (): APIRadioGroupActionComponent => {
		const data: APIRadioGroupActionComponent = {
			type: this.type,
			custom_id: this.customId,
			options: this.options
		}
		if (this.id !== undefined) data.id = this.id
		if (this.required !== undefined) data.required = this.required
		return data
	}
}
