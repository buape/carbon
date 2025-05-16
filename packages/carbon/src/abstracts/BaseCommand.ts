import {
	ApplicationCommandType,
	type RESTPostAPIApplicationCommandsJSONBody
} from "discord-api-types/v10"
import {
	ApplicationIntegrationType,
	type ArrayOrSingle,
	type BaseMessageInteractiveComponent,
	InteractionContextType,
	type Permission
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
	description?: string
	/**
	 * The localized name of the command
	 * @see https://discord.com/developers/docs/interactions/application-commands#localization
	 */
	nameLocalizations?: Record<string, string>
	/**
	 * The localized description of the command
	 * @see https://discord.com/developers/docs/interactions/application-commands#localization
	 */
	descriptionLocalizations?: Record<string, string>
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
	 */
	integrationTypes: ApplicationIntegrationType[] = [
		ApplicationIntegrationType.GuildInstall,
		ApplicationIntegrationType.UserInstall
	]
	/**
	 * The contexts this command can be used in
	 */
	contexts: InteractionContextType[] = [
		InteractionContextType.Guild,
		InteractionContextType.BotDM,
		InteractionContextType.PrivateChannel
	]

	/**
	 * The default permission that a user needs to have to use this command.
	 * This can be overridden by server admins.
	 */
	permission?: ArrayOrSingle<(typeof Permission)[keyof typeof Permission]>

	/**
	 * The components that this command uses.
	 * These will be registered with the client when the command is initialized.
	 */
	components?: BaseMessageInteractiveComponent[]

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
		      name_localizations: this.nameLocalizations,
		      description: this.description !== undefined ? this.description : "",
		      description_localizations: this.descriptionLocalizations,
		      type: this.type,
		      options: this.serializeOptions(),
		      integration_types: this.integrationTypes,
		      contexts: this.contexts,
		      default_member_permissions: Array.isArray(this.permission)
		        ? this.permission.reduce((a, p) => a | p, 0n).toString()
		        : this.permission
		          ? `${this.permission}`
		          : null
		    }	

			return data
		}
		const data: RESTPostAPIApplicationCommandsJSONBody = {
		    name: this.name,
		    name_localizations: this.nameLocalizations,
		    type: this.type,
		    options: this.serializeOptions(),
		    integration_types: this.integrationTypes,
		    contexts: this.contexts,
		    default_member_permissions: Array.isArray(this.permission)
		      ? this.permission.reduce((a, p) => a | p, 0n).toString()
		      : this.permission
			? `${this.permission}`
			: null
		  }

		return data
	}

	/**
	 * Serializes the options of the command into a JSON object that can be sent to Discord
	 * @internal
	 */
	abstract serializeOptions(): RESTPostAPIApplicationCommandsJSONBody["options"]
}
