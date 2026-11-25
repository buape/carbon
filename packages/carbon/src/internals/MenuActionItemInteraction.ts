import {
	type APIMenuActionItemInteraction,
	InteractionType
} from "discord-api-types/v10"
import { BaseComponentInteraction } from "../abstracts/BaseComponentInteraction.js"
import type { InteractionDefaults } from "../abstracts/BaseInteraction.js"
import type { Client } from "../classes/Client.js"
import type { BrandedAPIInteraction } from "../types/index.js"

export class MenuActionItemInteraction extends BaseComponentInteraction {
	constructor(
		client: Client,
		data: APIMenuActionItemInteraction,
		defaults: InteractionDefaults
	) {
		super(client, data, defaults)
		if (data.type !== InteractionType.MessageComponent) {
			throw new Error("Invalid interaction type was used to create this class")
		}
		if (data.data.component_type !== 26) {
			throw new Error("Invalid component type was used to create this class")
		}
	}

	get rawData() {
		return super.rawData as BrandedAPIInteraction<APIMenuActionItemInteraction>
	}
}
