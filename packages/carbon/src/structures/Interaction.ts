import type { APIInteraction, InteractionType } from "discord-api-types/v10"
import type { Client } from "../classes/Client.js"
import { Base } from "./Base.js"

/**
 * This is the base type interaction, all interaction types extend from this
 */
export abstract class BaseInteraction extends Base {
	/**
	 * The type of interaction
	 */
	type: InteractionType
	/**
	 * The raw data of the interaction
	 */
	rawData: APIInteraction

	constructor(client: Client, data: APIInteraction) {
		super(client)
		this.rawData = data
		this.type = data.type
	}
}
