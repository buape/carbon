import type { RESTPostAPIChatInputApplicationCommandsJSONBody } from "discord-api-types/v10"
import type { CommandInteraction } from "../structures/CommandInteraction.js"

/**
 * Represents a command that the user creates
 */
export abstract class Command {
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
	 * The function that is called when the command is ran
	 * @param interaction The interaction that triggered the command
	 */
	abstract run(interaction: CommandInteraction): Promise<void>

	/**
	 * Serializes the command into a JSON object that can be sent to Discord
	 */
	serialize() {
		return {
			name: this.name,
			description: this.description
		} satisfies RESTPostAPIChatInputApplicationCommandsJSONBody
	}
}
