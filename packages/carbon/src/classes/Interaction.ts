import type { APIInteraction, InteractionType } from "discord-api-types/v10";

export class Interaction {
	type: InteractionType
	constructor(data: APIInteraction) {
		this.type = data.type
	}

	reply(_text: string) {
		throw new Error("Not implemented")
	}
}