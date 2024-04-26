import {
	ComponentType,
	type APIMentionableSelectComponent
} from "discord-api-types/v10"
import { AnySelectMenu } from "../structures/AnySelectMenu.js"
import type { MentionableSelectMenuInteraction } from "../structures/MentionableSelectMenuInteraction.js"

export abstract class MentionableSelectMenu extends AnySelectMenu {
	type: ComponentType.MentionableSelect = ComponentType.MentionableSelect
	defaultValues?: APIMentionableSelectComponent["default_values"]
	abstract run(interaction: MentionableSelectMenuInteraction): Promise<void>

	serializeOptions() {
		return {
			type: this.type,
			default_values: this.defaultValues
		}
	}
}
