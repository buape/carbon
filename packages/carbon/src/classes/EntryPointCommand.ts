import {
	ApplicationCommandType,
	EntryPointCommandHandlerType,
	type RESTPostAPIApplicationCommandsJSONBody
} from "discord-api-types/v10"
import { BaseCommand } from "../abstracts/BaseCommand.js"

/**
 * Represents a Primary Entry Point command for Activities.
 */
export abstract class EntryPointCommand extends BaseCommand {
	type: ApplicationCommandType = ApplicationCommandType.PrimaryEntryPoint
	handler: EntryPointCommandHandlerType =
		EntryPointCommandHandlerType.DiscordLaunchActivity

	serializeOptions(): RESTPostAPIApplicationCommandsJSONBody["options"] {
		return undefined
	}
}
