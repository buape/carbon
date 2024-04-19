import {
	type RESTPostAPIChannelMessageJSONBody,
	Routes
} from "discord-api-types/v10"
import { BaseInteraction } from "./Interaction.js"

/**
 * Represents a command interaction
 */
export class CommandInteraction extends BaseInteraction {
	/**
	 * Reply to an interaction.
	 * If the interaction is deferred, this will edit the original response.
	 * @param data The response data
	 */
	async reply(data: RESTPostAPIChannelMessageJSONBody) {
		// TODO: Handle non-deferred

		console.log(JSON.stringify(data, null, 2))
		this.client.rest.patch(
			Routes.webhookMessage(
				this.rawData.application_id,
				this.rawData.token,
				"@original"
			),
			{ body: data }
		)
	}
}
