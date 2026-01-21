import type {
	APICheckboxActionComponent,
	APICheckboxGroupActionComponent,
	APIFileUploadComponent,
	APIRadioGroupActionComponent,
	APITextInputComponent,
	ComponentType
} from "discord-api-types/v10"
import type { APILabelComponent2 } from "../types/index.js"
import { BaseComponent } from "./BaseComponent.js"

export abstract class BaseModalComponent extends BaseComponent {
	abstract override type: ComponentType

	readonly isV2 = true

	abstract serialize: () =>
		| APITextInputComponent
		| APILabelComponent2
		| APIFileUploadComponent
		| APICheckboxGroupActionComponent
		| APICheckboxActionComponent
		| APIRadioGroupActionComponent
}
