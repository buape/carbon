import {
	type APIStringSelectComponent,
	ComponentType
} from "discord-api-types/v10"
import { AnySelectMenu } from "../../abstracts/AnySelectMenu.js"
import type { StringSelectMenuInteraction } from "../../internals/StringSelectMenuInteraction.js"
import type { ComponentData } from "../../types/index.js"

export abstract class StringSelectMenu extends AnySelectMenu {
	readonly type = ComponentType.StringSelect as const
	readonly isV2 = false
	abstract options: APIStringSelectComponent["options"]
	run(
		interaction: StringSelectMenuInteraction,
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
			options: this.options
		}
	}
}
