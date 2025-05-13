import {
	type APIRoleSelectComponent,
	ComponentType
} from "discord-api-types/v10"
import { AnySelectMenu } from "../../abstracts/AnySelectMenu.js"
import type { RoleSelectMenuInteraction } from "../../internals/RoleSelectMenuInteraction.js"
import type { ComponentData } from "../../types/index.js"

export abstract class RoleSelectMenu extends AnySelectMenu {
	readonly type = ComponentType.RoleSelect as const
	readonly isV2 = false
	defaultValues?: APIRoleSelectComponent["default_values"]
	run(
		interaction: RoleSelectMenuInteraction,
		data: ComponentData
	): unknown | Promise<unknown> {
		// Random things to show the vars as used
		typeof interaction === "string"
		typeof data === "string"
		return
	}

	serializeOptions() {
		return {
			type: this.type,
			default_values: this.defaultValues
		}
	}
}
