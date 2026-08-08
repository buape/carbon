import {
	type DiscordRawError,
	errorMapper,
	type TransformedError
} from "../functions/errorsMapper.js"
import { BaseError } from "./BaseError.js"

export class DiscordError extends BaseError {
	/**
	 * The HTTP status code of the response from Discord
	 * @see https://discord.com/developers/docs/topics/opcodes-and-status-codes#http
	 */
	status: number
	/**
	 * The Discord error code
	 * @see https://discord.com/developers/docs/topics/opcodes-and-status-codes#json
	 */
	discordCode?: number
	/**
	 * An array of the errors that were returned by Discord
	 */
	errors: TransformedError[]

	/**
	 * The raw body of the error from Discord
	 * @internal
	 */
	rawBody!: DiscordRawError

	constructor(response: Response, body: DiscordRawError, message?: string) {
		const errors = errorMapper(body)
		super(message ?? DiscordError.formatMessage(response, body, errors))
		this.status = response.status
		this.discordCode = body.code
		this.errors = errors
		Object.defineProperty(this, "rawBody", {
			value: body,
			enumerable: false,
			writable: true,
			configurable: true
		})
	}

	toJSON() {
		return {
			...super.toJSON(),
			status: this.status,
			discordCode: this.discordCode,
			errors: this.errors
		}
	}

	private static formatMessage(
		response: Response,
		body: DiscordRawError,
		errors: TransformedError[]
	) {
		const status = response.statusText
			? `${response.status} ${response.statusText}`
			: `${response.status}`
		const code = body.code === undefined ? "" : `, Discord code ${body.code}`
		const details = errors.map((error) => {
			const location = error.location ? `${error.location}: ` : ""
			return `- ${location}${error.message} (${error.code})`
		})

		return [`${body.message} (${status}${code})`, ...details].join("\n")
	}
}
