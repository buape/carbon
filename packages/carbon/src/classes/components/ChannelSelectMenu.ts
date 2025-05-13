import {
	type APIChannelSelectComponent,
	ComponentType
} from "discord-api-types/v10"
import { AnySelectMenu } from "../../abstracts/AnySelectMenu.js"
import type { ChannelSelectMenuInteraction } from "../../internals/ChannelSelectMenuInteraction.js"
import type { ComponentData } from "../../types/index.js"

export abstract class ChannelSelectMenu extends AnySelectMenu {
	readonly type = ComponentType.ChannelSelect as const
	readonly isV2 = false
	channelTypes?: APIChannelSelectComponent["channel_types"]
	defaultValues?: APIChannelSelectComponent["default_values"]
	run(
		interaction: ChannelSelectMenuInteraction,
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
			default_values: this.defaultValues,
			channel_types: this.channelTypes
		}
	}
}
