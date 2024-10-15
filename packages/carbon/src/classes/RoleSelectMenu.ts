import {
	type APIRoleSelectComponent,
	ComponentType
} from "discord-api-types/v10"
import { AnySelectMenu } from "../abstracts/AnySelectMenu.js"
import type { RoleSelectMenuInteraction } from "../internals/RoleSelectMenuInteraction.js"

export abstract class RoleSelectMenu extends AnySelectMenu {
	type: ComponentType.RoleSelect = ComponentType.RoleSelect
	defaultValues?: APIRoleSelectComponent["default_values"]
	abstract run(interaction: RoleSelectMenuInteraction): Promise<void>

	serializeExtra() {
		return {
			options: {
				type: this.type,
				default_values: this.defaultValues
			}
		}
	}
}
