import type { RESTPostAPIChatInputApplicationCommandsJSONBody } from "discord-api-types/v10"
import type { CommandInteraction } from "../structures/CommandInteraction.js"

export abstract class Command {
	abstract name: string
	abstract description: string
	defer = false
	ephemeral = false

	abstract run(interaction: CommandInteraction): Promise<void>

	serialize() {
		return {
			name: this.name,
			description: this.description
		} satisfies RESTPostAPIChatInputApplicationCommandsJSONBody
	}
}
