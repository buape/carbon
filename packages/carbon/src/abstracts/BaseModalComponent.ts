import type {
	APILabelComponent,
	APITextInputComponent,
	ComponentType
} from "discord-api-types/v10"
import { BaseComponent } from "./BaseComponent.js"

export abstract class BaseModalComponent extends BaseComponent {
	abstract override type: ComponentType

	readonly isV2 = false

	abstract serialize: () => APITextInputComponent | APILabelComponent
}
