import {
	ComponentType,
	type APIUserSelectComponent
} from "discord-api-types/v10"
import { AnySelectMenu } from "../structures/AnySelectMenu.js"
import type { UserSelectMenuInteraction } from "../structures/UserSelectMenuInteraction.js"

export abstract class UserSelectMenu extends AnySelectMenu {
	type: ComponentType.UserSelect = ComponentType.UserSelect
	defaultValues?: APIUserSelectComponent["default_values"]
	abstract run(interaction: UserSelectMenuInteraction): Promise<void>

	serializeOptions() {
		return {
			type: this.type,
			default_values: this.defaultValues
		}
	}
}
