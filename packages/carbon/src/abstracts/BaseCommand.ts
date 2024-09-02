import type {
	ApplicationCommandType,
	RESTPostAPIApplicationCommandsJSONBody
} from "discord-api-types/v10"
import { ApplicationIntegrationType, InteractionContextType } from "../index.js"
import type { BaseComponent } from "./BaseComponent.js"

/**
 * Represents the base data of a command that the user creates
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
	 * The places this command can be used in
	 * @beta API types are not finalized
	 */
	integrationTypes: ApplicationIntegrationType[] = [
		ApplicationIntegrationType.GuildInstall,
		ApplicationIntegrationType.UserInstall
	]
	/**
	 * The contexts this command can be used in
	 * @beta API types are not finalized
	 */
	contexts: InteractionContextType[] = [
		InteractionContextType.Guild,
		InteractionContextType.BotDM,
		InteractionContextType.PrivateChannel
	]

	/**
	 * All the components that the command is able to use.
	 * You mount these here so the handler can access them
	 */
	components?: BaseComponent[] = []
	/**
	 * All the paginators that the command is able to use.
	 * You mount these here so the handler can access them
	 */
	// paginators?: Paginator[] = []

	/**
	 * Serializes the command into a JSON object that can be sent to Discord
	 * @internal
	 */
	serialize() {
		const data: RESTPostAPIApplicationCommandsJSONBody & {
			integration_types: ApplicationIntegrationType[]
			contexts: InteractionContextType[]
		} = {
			name: this.name,
			description: this.description,
			type: this.type,
			options: this.serializeOptions(),
			integration_types: this.integrationTypes,
			contexts: this.contexts
		}

		return data
	}

	/**
	 * Serializes the options of the command into a JSON object that can be sent to Discord
	 * @internal
	 */
	abstract serializeOptions(): RESTPostAPIApplicationCommandsJSONBody["options"]
}
