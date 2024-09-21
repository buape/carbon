import type { Embed } from "./classes/Embed.js"
import type { Row } from "./classes/Row.js"

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
			allowedMentions?: {
				parse?: ["roles", "users", "everyone"]
				roles?: string[]
				users?: string[]
			}
			/**
			 * The flags for the message
			 */
			flags?: number
			/**
			 * Whether the message should be TTS
			 */
			tts?: boolean
	  }
	| string
