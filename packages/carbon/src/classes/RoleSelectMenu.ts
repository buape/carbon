import {
	ComponentType,
	type APIRoleSelectComponent
} from "discord-api-types/v10"
import { AnySelectMenu } from "../structures/AnySelectMenu.js"
import type { RoleSelectMenuInteraction } from "../structures/RoleSelectMenuInteraction.js"

export abstract class RoleSelectMenu extends AnySelectMenu {
	type: ComponentType.RoleSelect = ComponentType.RoleSelect
	defaultValues?: APIRoleSelectComponent["default_values"]
	abstract run(interaction: RoleSelectMenuInteraction): Promise<void>

	serializeOptions() {
		return {
			type: this.type,
			default_values: this.defaultValues
		}
	}
}
