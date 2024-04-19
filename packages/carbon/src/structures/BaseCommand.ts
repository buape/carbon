import type {
	ApplicationCommandType,
	RESTPostAPIApplicationCommandsJSONBody
} from "discord-api-types/v10"

/**
 * Represents the base data of a command that the user creates
 * @abstract
 */
export abstract class BaseCommand {
	/**
	 * The name of the command (e.g. "ping" for /ping)
	 */
	abstract name: string
	/**
	 * A description of the command
	 */
	abstract description: string
	/**
	 * Whether the command response should be automatically deferred
	 */
	defer = false
	/**
	 * Whether the command response should be ephemeral
	 */
	ephemeral = false
	/**
	 * The type of the command
	 */
	abstract type: ApplicationCommandType

	/**
	 * Serializes the command into a JSON object that can be sent to Discord
	 */
	serialize() {
		const data: RESTPostAPIApplicationCommandsJSONBody = {
			name: this.name,
			description: this.description,
			type: this.type,
			options: this.serializeOptions()
		}

		return data
	}

	/**
	 * Serializes the options of the command into a JSON object that can be sent to Discord
	 */
	abstract serializeOptions(): RESTPostAPIApplicationCommandsJSONBody["options"]
}
