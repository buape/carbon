import {
	type APIChannelSelectComponent,
	ComponentType
} from "discord-api-types/v10"
import { AnySelectMenu } from "../../abstracts/AnySelectMenu.js"
import type { ChannelSelectMenuInteraction } from "../../internals/ChannelSelectMenuInteraction.js"

export abstract class ChannelSelectMenu extends AnySelectMenu {
	readonly type = ComponentType.ChannelSelect as const
	readonly isV2 = false
	channelTypes?: APIChannelSelectComponent["channel_types"]
	defaultValues?: APIChannelSelectComponent["default_values"]
	abstract run(interaction: ChannelSelectMenuInteraction): Promise<void>

	serializeOptions() {
		return {
			type: this.type,
			default_values: this.defaultValues,
			channel_types: this.channelTypes
		}
	}
}
