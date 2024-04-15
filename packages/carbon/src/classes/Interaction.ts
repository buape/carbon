import { RouteBases, Routes, type APIInteraction, type InteractionType, type RESTPostAPIChannelMessageJSONBody } from "discord-api-types/v10";

export class Interaction {
	type: InteractionType
	#data: APIInteraction
	constructor(data: APIInteraction) {
		this.#data = data
		this.type = data.type
	}

	async reply(data: RESTPostAPIChannelMessageJSONBody) {
		fetch(RouteBases.api + Routes.webhookMessage(this.#data.application_id, this.#data.token, "@original"), {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(data)
		})
	}
}