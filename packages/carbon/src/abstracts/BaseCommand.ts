import {
	ApplicationCommandType,
	type RESTPostAPIApplicationCommandsJSONBody
} from "discord-api-types/v10"
import {
	ApplicationIntegrationType,
	type BaseComponent,
	InteractionContextType,
	type Modal
} from "../index.js"

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
	 * The components that the command is able to use.
	 * You pass these here so the handler can listen for them..
	 */
	components: (new () => BaseComponent)[] = []

	/**
	 * All the modals that the command is able to use.
	 * You pass these here so the handler can listen for them.
	 */
	modals: (new () => Modal)[] = []

	/**
	 * Serializes the command into a JSON object that can be sent to Discord
	 * @internal
	 */
	serialize() {
		if (this.type === ApplicationCommandType.PrimaryEntryPoint) {
			throw new Error("Primary Entry Point commands cannot be serialized")
		}
		// Only chat input commands can have descriptions
		if (this.type === ApplicationCommandType.ChatInput) {
			const data: RESTPostAPIApplicationCommandsJSONBody = {
				name: this.name,
				type: this.type,
				description: this.description,
				default_member_permissions: this.serializePermissions(),
				options: this.serializeOptions(),
				integration_types: this.integrationTypes,
				contexts: this.contexts
			}

			return data
		}
		const data: RESTPostAPIApplicationCommandsJSONBody = {
			name: this.name,
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

	/**
	 * Serializes the permissions of the command into a JSON object that can be sent to Discord
	 * @internal
	 */
	abstract serializePermissions(): RESTPostAPIApplicationCommandsJSONBody["default_member_permissions"]
}
