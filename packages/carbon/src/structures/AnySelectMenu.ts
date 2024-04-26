import type {
	APIChannelSelectComponent,
	APIMentionableSelectComponent,
	APIRoleSelectComponent,
	APISelectMenuComponent,
	APIStringSelectComponent,
	APIUserSelectComponent,
	ComponentType
} from "discord-api-types/v10"
import type { AnySelectMenuInteraction } from "./AnySelectMenuInteraction.js"
import { BaseComponent } from "./BaseComponent.js"

export type AnySelectMenuComponentType =
	| ComponentType.ChannelSelect
	| ComponentType.RoleSelect
	| ComponentType.StringSelect
	| ComponentType.UserSelect
	| ComponentType.MentionableSelect

export abstract class AnySelectMenu extends BaseComponent {
	abstract type: AnySelectMenuComponentType
	abstract run(interaction: AnySelectMenuInteraction): Promise<void>

	minValues?: number
	maxValues?: number
	disabled?: boolean
	placeholder?: string

	serialize = (): APISelectMenuComponent => {
		const options = this.serializeOptions()
		return {
			...options,
			custom_id: this.customId,
			disabled: this.disabled,
			placeholder: this.placeholder,
			min_values: this.minValues,
			max_values: this.maxValues
		}
	}

	abstract serializeOptions():
		| {
				type: ComponentType.ChannelSelect
				channel_types: APIChannelSelectComponent["channel_types"]
				default_values: APIChannelSelectComponent["default_values"]
		  }
		| {
				type: ComponentType.StringSelect
				options: APIStringSelectComponent["options"]
		  }
		| {
				type: ComponentType.RoleSelect
				default_values: APIRoleSelectComponent["default_values"]
		  }
		| {
				type: ComponentType.UserSelect
				default_values: APIUserSelectComponent["default_values"]
		  }
		| {
				type: ComponentType.MentionableSelect
				default_values: APIMentionableSelectComponent["default_values"]
		  }
}
