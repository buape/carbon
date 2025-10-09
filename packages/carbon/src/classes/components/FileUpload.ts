import {
	type APIFileUploadComponent,
	BaseModalComponent
} from "../../abstracts/BaseModalComponent.js"

export abstract class FileUpload extends BaseModalComponent {
	// @ts-expect-error - Unreleased component type
	readonly type = 19 // ComponentType.FileUpload

	abstract customId: string
	/**
	 * The minimum number of files that must be uploaded
	 * Defaults to 1, minimum is 0, maximum is 10
	 */
	minValues?: number
	/**
	 * The maximum number of files that can be uploaded
	 * Defaults to 1, maximum is 10
	 */
	maxValues?: number
	/**
	 * Whether the component is required
	 * Defaults to true
	 */
	required?: boolean

	serialize = (): APIFileUploadComponent => {
		const data: APIFileUploadComponent = {
			type: this.type,
			custom_id: this.customId
		}
		if (this.id !== undefined) data.id = this.id
		if (this.minValues !== undefined) data.min_values = this.minValues
		if (this.maxValues !== undefined) data.max_values = this.maxValues
		if (this.required !== undefined) data.required = this.required
		return data
	}
}
