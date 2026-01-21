import type {
	APICheckboxActionComponent,
	APICheckboxGroupActionComponent,
	APIFileUploadComponent,
	APILabelComponent,
	APIRadioGroupActionComponent,
	APITextInputComponent,
	ComponentType
} from "discord-api-types/v10"
import { BaseComponent } from "./BaseComponent.js"

export abstract class BaseModalComponent extends BaseComponent {
	abstract override type: ComponentType

	readonly isV2 = true

	abstract serialize: () =>
		| APITextInputComponent
		| APILabelComponent
		| APIFileUploadComponent
		| APICheckboxGroupActionComponent
		| APICheckboxActionComponent
		| APIRadioGroupActionComponent
}
