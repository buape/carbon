import type {
	APILabelComponent,
	APITextInputComponent,
	ComponentType
} from "discord-api-types/v10"
import { BaseComponent } from "./BaseComponent.js"

export type APIFileUploadComponent = {
	type: 18
	id?: number
	custom_id: string
	min_values?: number
	max_values?: number
	required?: boolean
}
export abstract class BaseModalComponent extends BaseComponent {
	abstract override type: ComponentType

	readonly isV2 = true

	// @ts-expect-error - Unreleased component type
	abstract serialize: () =>
		| APITextInputComponent
		| APILabelComponent
		| APIFileUploadComponent
}
