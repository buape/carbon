
import {
	type RESTPostAPIChannelMessageJSONBody,
	Routes
} from "discord-api-types/v10"
import { BaseInteraction } from "./Interaction.js"

export class CommandInteraction extends BaseInteraction {
	async reply(data: RESTPostAPIChannelMessageJSONBody) {
		this.client.rest.patch(
			Routes.webhookMessage(
				this.rawData.application_id,
				this.rawData.token,
				"@original"
			), { body: JSON.stringify(data) })
	}
}
