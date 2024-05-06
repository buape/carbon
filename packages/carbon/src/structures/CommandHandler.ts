import { Base } from "./Base.js"
import {
	type APIApplicationCommandSubcommandGroupOption,
	type APIChatInputApplicationCommandInteractionData,
	ApplicationCommandOptionType,
	ApplicationCommandType,
	InteractionResponseType,
	MessageFlags,
	type APIApplicationCommandInteraction
} from "discord-api-types/v10"
import { Command } from "../classes/Command.js"
import { CommandWithSubcommandGroups } from "../classes/CommandWithSubcommandGroups.js"
import { CommandWithSubcommands } from "../classes/CommandWithSubcommands.js"
import { CommandInteraction } from "./CommandInteraction.js"

export class CommandHandler extends Base {
	handleInteraction(
		rawInteraction: APIApplicationCommandInteraction
	): Record<string, unknown> | false {
		const command = this.client.commands.find(
			(x) => x.name === rawInteraction.data.name
		)
		if (!command) return false

		const interaction = new CommandInteraction(
			this.client,
			rawInteraction,
			command
		)

		if (command instanceof Command) {
			if (command.defer) {
				command.run(interaction)
				return {
					type: InteractionResponseType.DeferredChannelMessageWithSource,
					flags: command.ephemeral ? MessageFlags.Ephemeral : 0
				}
			}
			return {
				type: InteractionResponseType.ChannelMessageWithSource,
				content: "Man someone should really implement non-deferred replies huh"
			}
		}

		if (command instanceof CommandWithSubcommandGroups) {
			if (rawInteraction.data.type !== ApplicationCommandType.ChatInput) {
				return {
					type: InteractionResponseType.ChannelMessageWithSource,
					data: {
						content: "Subcommand groups must be used with ChatInput"
					}
				}
			}
			const data = rawInteraction.data
			const subcommandGroupName = data.options?.find(
				(x) => x.type === ApplicationCommandOptionType.SubcommandGroup
			)?.name
			if (!subcommandGroupName) return false

			const subcommandGroup = command.subcommandGroups.find(
				(x) => x.name === subcommandGroupName
			)

			if (!subcommandGroup) return false

			const subcommandName = (
				data.options?.find(
					(x) => x.type === ApplicationCommandOptionType.SubcommandGroup
				) as APIApplicationCommandSubcommandGroupOption
			).options?.find(
				(x) => x.type === ApplicationCommandOptionType.Subcommand
			)?.name
			if (!subcommandName) return false

			const subcommand = subcommandGroup.subcommands.find(
				(x) => x.name === subcommandName
			)

			if (!subcommand) return false

			if (subcommand.defer) {
				subcommand.run(interaction)
				return {
					type: InteractionResponseType.DeferredChannelMessageWithSource,
					flags: subcommand.ephemeral ? MessageFlags.Ephemeral : 0
				}
			}
			return {
				type: InteractionResponseType.ChannelMessageWithSource,
				content: "Man someone should really implement non-deferred replies huh"
			}
		}

		if (command instanceof CommandWithSubcommands) {
			if (rawInteraction.data.type !== ApplicationCommandType.ChatInput) {
				return {
					type: InteractionResponseType.ChannelMessageWithSource,
					data: {
						content: "Subcommands must be used with ChatInput"
					}
				}
			}
			const data = rawInteraction.data
			const subcommand = command.subcommands.find(
				(x) => x.name === data.options?.[0]?.name
			)
			if (!subcommand) return false

			if (subcommand.defer) {
				subcommand.run(interaction)
				return {
					type: InteractionResponseType.DeferredChannelMessageWithSource,
					flags: subcommand.ephemeral ? MessageFlags.Ephemeral : 0
				}
			}
			return {
				type: InteractionResponseType.ChannelMessageWithSource,
				content: "Man someone should really implement non-deferred replies huh"
			}
		}

		console.error(`Command ${command.name} is not a valid command type`)
		console.log(
			(rawInteraction.data as APIChatInputApplicationCommandInteractionData)
				.options
		)
		return false
	}
}
