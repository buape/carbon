import type {
	APIInteraction,
	InteractionType
} from "discord-api-types/v10"
import type { Client } from "../classes/Client.js"
import { Base } from "./Base.js"

export abstract class BaseInteraction extends Base {
	type: InteractionType
	rawData: APIInteraction

	constructor(client: Client, data: APIInteraction) {
		super(client)
		this.rawData = data
		this.type = data.type
	}
}
