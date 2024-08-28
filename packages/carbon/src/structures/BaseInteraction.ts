import {
	type APIInteraction,
	InteractionResponseType,
	type InteractionType,
	Routes
} from "discord-api-types/v10"
import type { Client } from "../classes/Client.js"
import { Base } from "./Base.js"
import type { Row } from "../classes/Row.js"

/**
 * The data to reply to an interaction
 */
export type InteractionReplyData = {
	/**
	 * The content of the message
	 */
	content?: string
	/**
	 * The components to send in the message, listed in rows
	 */
	components?: Row[]
}

/**
 * Additional options for replying to an interaction
 */
export type InteractionReplyOptions = {
	/**
	 * The files to send in the interaction
	 */
	files?: InteractionFileData[]
}

/**
 * The data for a file to send in an interaction
 */
export type InteractionFileData = {
	/**
	 * The name of the file that will be given to Discord
	 */
	name: string
	/**
	 * The data of the file in a Blob
	 */
	data: Blob
	/**
	 * The alt text of the file, shown for accessibility
	 * @alpha This isn't implemented yet
	 */
	description?: string
}

/**
 * This is the base type interaction, all interaction types extend from this
 * @abstract
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
	/**
	 * The user who sent the interaction
	 */
	userId: string | undefined

	/**
	 * Whether the interaction is deferred already
	 * @internal
	 */
	_deferred = false

	constructor(client: Client, data: APIInteraction) {
		super(client)
		this.rawData = data
		this.type = data.type
		this.userId =
			this.rawData.user?.id || this.rawData.member?.user.id || undefined
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
		if (this._deferred) {
			console.log(data)
			const response = await fetch(
				`https://discord.com/api/v10/webhooks/${this.client.options.clientId}/${this.rawData.token}`,
				{
					method: "POST",
					body: JSON.stringify({
						...data,
						components: data.components?.map((row) => row.serialize())
					}),
					headers: {
						"Content-Type": "application/json"
					}
				}
			).catch((err) => {
				console.error(err)
				throw err
			})
			console.log(response.json(), response.status)
			// await this.client.rest.patch(
			// 	Routes.webhookMessage(
			// 		this.client.options.clientId,
			// 		this.rawData.token,
			// 		"@original"
			// 	),
			// 	{
			// 		body: {
			// 			...data,
			// 			components: data.components?.map((row) => row.serialize())
			// 		},
			// 		files: options.files
			// 	}
			// )
			console.log("reply done")
		} else {
			await this.client.rest.post(
				Routes.interactionCallback(this.rawData.id, this.rawData.token),
				{
					body: {
						type: InteractionResponseType.ChannelMessageWithSource,
						data: {
							...data,
							components: data.components?.map((row) => row.serialize())
						}
					},
					files: options.files
				}
			)
		}
	}

	/**
	 * Defer the interaction response. This is used automatically by commands that are set to defer.
	 * If the interaction is already deferred, this will do nothing.
	 * @internal
	 */
	async defer() {
		if (this._deferred) return
		this._deferred = true
		await this.client.rest.post(
			Routes.interactionCallback(this.rawData.id, this.rawData.token),
			{
				body: {
					type: InteractionResponseType.DeferredChannelMessageWithSource
				}
			}
		)
	}
}
