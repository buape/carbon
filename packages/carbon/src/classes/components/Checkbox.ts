import type { APICheckboxActionComponent } from "discord-api-types/v10"
import { BaseModalComponent } from "../../abstracts/BaseModalComponent.js"

export abstract class Checkbox extends BaseModalComponent {
	readonly type = 23 as const

	abstract customId: string

	/**
	 * Whether the checkbox is checked by default
	 */
	default?: boolean

	serialize = (): APICheckboxActionComponent => {
		const data: APICheckboxActionComponent = {
			type: this.type,
			custom_id: this.customId
		}
		if (this.id !== undefined) data.id = this.id
		if (this.default !== undefined) data.default = this.default
		return data
	}
}
