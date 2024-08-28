import {
	type APIStringSelectComponent,
	ComponentType
} from "discord-api-types/v10"
import { AnySelectMenu } from "../abstracts/AnySelectMenu.js"
import type { StringSelectMenuInteraction } from "../abstracts/StringSelectMenuInteraction.js"

export abstract class StringSelectMenu extends AnySelectMenu {
	type: ComponentType.StringSelect = ComponentType.StringSelect
	abstract options: APIStringSelectComponent["options"]
	abstract run(interaction: StringSelectMenuInteraction): Promise<void>

	serializeOptions() {
		return {
			type: this.type,
			options: this.options
		}
	}
}
