import type {
	APIChannelSelectComponent,
	APIMentionableSelectComponent,
	APIRoleSelectComponent,
	APISelectMenuComponent,
	APIStringSelectComponent,
	APIUserSelectComponent,
	ComponentType
} from "discord-api-types/v10"
import type { ComponentData } from "../types/index.js"
import type { AnySelectMenuInteraction } from "./AnySelectMenuInteraction.js"
import { BaseMessageInteractiveComponent } from "./BaseMessageInteractiveComponent.js"
export type AnySelectMenuComponentType =
	| ComponentType.ChannelSelect
	| ComponentType.RoleSelect
	| ComponentType.StringSelect
	| ComponentType.UserSelect
	| ComponentType.MentionableSelect

export abstract class AnySelectMenu extends BaseMessageInteractiveComponent {
	abstract type: AnySelectMenuComponentType
	run(
		interaction: AnySelectMenuInteraction,
		data: ComponentData
	): unknown | Promise<unknown> {
		// Random things to show the vars as used
		typeof interaction === "string"
		typeof data === "string"
		return
	}

	minValues?: number
	maxValues?: number
	disabled?: boolean
	placeholder?: string

	serialize = (): APISelectMenuComponent => {
		const options = this.serializeOptions()
		const extra = this.serializeExtra()
		const data = {
			...options,
			custom_id: this.customId,
			disabled: this.disabled,
			placeholder: this.placeholder,
			min_values: this.minValues,
			max_values: this.maxValues,
			...extra
		}
		for (const key of this.serializeDeleteKeys) {
			delete (data as Record<string, unknown>)[key]
		}
		return data
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

	serializeExtra(): Record<string, unknown> {
		return {}
	}

	protected get serializeDeleteKeys(): string[] {
		return []
	}
}
