import {
	type APIInteraction,
	type InteractionType,
	Routes
} from "discord-api-types/v10"
import type { Client } from "../classes/Client.js"
import { Base } from "./Base.js"

/**
 * The data to reply to an interaction
 */
type InteractionReplyData = {
	content?: string
}

/**
 * Additional options for replying to an interaction
 */
type InteractionReplyOptions = {
	files?: InteractionFileData[]
}

type InteractionFileData = {
	name: string
	data: Blob
	/**
	 * @alpha This isn't implemented yet
	 */
	description?: string
}

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

	/**
	 * Reply to an interaction.
	 * If the interaction is deferred, this will edit the original response.
	 * @param data The response data
	 */
	async reply(
		data: InteractionReplyData,
		options: InteractionReplyOptions = {}
	) {
		// TODO: Handle non-deferred
		this.client.rest.patch(
			Routes.webhookMessage(
				this.rawData.application_id,
				this.rawData.token,
				"@original"
			),
			{ body: data, files: options.files }
		)
	}
}
