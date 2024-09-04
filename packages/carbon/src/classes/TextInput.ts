import {
	type APITextInputComponent,
	ComponentType,
	TextInputStyle
} from "discord-api-types/v10"
import { BaseComponent } from "../abstracts/BaseComponent.js"

export abstract class TextInput extends BaseComponent {
	type = ComponentType.TextInput

	/**
	 * The custom ID of the text input
	 */
	abstract customId: string

	/**
	 * The label of the text input
	 */
	abstract label: string

	/**
	 * The style of the text input
	 * @default TextInputStyle.Short
	 */
	style: TextInputStyle = TextInputStyle.Short

	/**
	 * The minimum length of the text input
	 */
	minLength?: number

	/**
	 * The maximum length of the text input
	 */
	maxLength?: number

	/**
	 * Whether the text input is required
	 */
	required?: boolean

	/**
	 * The value of the text input
	 */
	value?: string

	/**
	 * The placeholder of the text input
	 */
	placeholder?: string

	serialize = (): APITextInputComponent => {
		return {
			type: ComponentType.TextInput,
			custom_id: this.customId,
			style: this.style,
			label: this.label,
			min_length: this.minLength,
			max_length: this.maxLength,
			required: this.required,
			value: this.value,
			placeholder: this.placeholder
		}
	}
}
