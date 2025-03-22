import type { APIAllowedMentions } from "discord-api-types/v10"
import type { Embed } from "./classes/Embed.js"
import type { Row } from "./classes/Row.js"

export type AllowedMentions = APIAllowedMentions

/**
 * The data that is sent to Discord when sending a message.
 * If you pass just a string, it will be treated as the content of the message.
 */
export type MessagePayload =
	| {
			/**
			 * The content of the message
			 */
			content?: string
			/**
			 * The embeds of the message
			 */
			embeds?: Embed[]
			/**
			 * The components to send in the message, listed in rows
			 */
			components?: Row[]
			/**
			 * The settings for which mentions are allowed in the message
			 */
			allowedMentions?: AllowedMentions
			/**
			 * The flags for the message
			 */
			flags?: number
			/**
			 * Whether the message should be TTS
			 */
			tts?: boolean
			/**
			 * The files to send in the message
			 */
			files?: MessagePayloadFile[]
	  }
	| string

/**
 * The data for a file to send in an interaction
 */
export type MessagePayloadFile = {
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

export type ArrayOrSingle<T> = T | T[]
