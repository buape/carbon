import {
	ApplicationCommandType,
	type RESTPostAPIApplicationCommandsJSONBody
} from "discord-api-types/v10"
import {
	ApplicationIntegrationType,
	type ArrayOrSingle,
	type BaseMessageInteractiveComponent,
	type ConditionalCommandOption,
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
	 * The ID of the command from Discord (set after deployment)
	 */
	id?: string
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
	 * Whether the command response should be automatically deferred.
	 * Can be a boolean or a function that receives the interaction and returns a boolean.
	 */
	defer: boolean | ConditionalCommandOption = false
	/**
	 * Whether the command response should be ephemeral.
	 * Can be a boolean or a function that receives the interaction and returns a boolean.
	 */
	ephemeral: boolean | ConditionalCommandOption = false
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
	 * The guild IDs this command should be deployed to (guild-specific deployment).
	 * If not set, the command is deployed globally.
	 */
	guildIds?: string[]

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
				description: this.description ?? "",
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

	/**
	 * Get a mention string for this command that can be used in messages
	 * @param client The client instance to fetch command data from if needed
	 * @returns A string in the format `</name:id>` that Discord will render as a command mention
	 * @remarks If the command ID is not set, this will fetch the commands from Discord to get the ID
	 */
	async getMention(client: { getDiscordCommands: () => Promise<Array<{ id: string; name: string }>> }): Promise<string> {
		if (!this.id) {
			const commands = await client.getDiscordCommands()
			const command = commands.find((c) => c.name === this.name)
			if (command) {
				this.id = command.id
			} else {
				throw new Error(`Command ${this.name} not found in Discord`)
			}
		}
		return `</${this.name}:${this.id}>`
	}
}
