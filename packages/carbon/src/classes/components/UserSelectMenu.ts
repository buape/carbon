import {
	type APIUserSelectComponent,
	ComponentType
} from "discord-api-types/v10"
import { AnySelectMenu } from "../../abstracts/AnySelectMenu.js"
import type { UserSelectMenuInteraction } from "../../internals/UserSelectMenuInteraction.js"
import type { ComponentData } from "../../types/index.js"

export abstract class UserSelectMenu extends AnySelectMenu {
	readonly type = ComponentType.UserSelect as const
	readonly isV2 = false
	defaultValues?: APIUserSelectComponent["default_values"]
	run(
		interaction: UserSelectMenuInteraction,
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
