import {
	type APIRoleSelectComponent,
	ComponentType
} from "discord-api-types/v10"
import { AnySelectMenu } from "../../abstracts/AnySelectMenu.js"
import type { RoleSelectMenuInteraction } from "../../internals/RoleSelectMenuInteraction.js"

export abstract class RoleSelectMenu extends AnySelectMenu {
	readonly type = ComponentType.RoleSelect as const
	readonly isV2 = false
	defaultValues?: APIRoleSelectComponent["default_values"]
	abstract run(interaction: RoleSelectMenuInteraction): Promise<void>

	serializeOptions() {
		return {
			type: this.type,
			default_values: this.defaultValues
		}
	}
}
