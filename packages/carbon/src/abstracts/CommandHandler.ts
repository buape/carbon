import {
	type APIApplicationCommandInteraction,
	type APIApplicationCommandSubcommandGroupOption,
	type APIChatInputApplicationCommandInteractionData,
	ApplicationCommandOptionType,
	ApplicationCommandType
} from "discord-api-types/v10"
import { Command } from "../classes/Command.js"
import { CommandWithSubcommandGroups } from "../classes/CommandWithSubcommandGroups.js"
import { CommandWithSubcommands } from "../classes/CommandWithSubcommands.js"
import { Base } from "./Base.js"
import { CommandInteraction } from "./CommandInteraction.js"

export class CommandHandler extends Base {
	async handleInteraction(rawInteraction: APIApplicationCommandInteraction) {
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
				await interaction.defer()
			}
			await command.run(interaction)
			return
		}

		if (command instanceof CommandWithSubcommandGroups) {
			if (rawInteraction.data.type !== ApplicationCommandType.ChatInput) {
				return await interaction.reply({
					content: "Subcommand groups must be used with ChatInput"
				})
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
				await interaction.defer()
			}
			return await subcommand.run(interaction)
		}

		if (command instanceof CommandWithSubcommands) {
			if (rawInteraction.data.type !== ApplicationCommandType.ChatInput) {
				return interaction.reply({
					content: "Subcommands must be used with ChatInput"
				})
			}
			const data = rawInteraction.data
			const subcommand = command.subcommands.find(
				(x) => x.name === data.options?.[0]?.name
			)
			if (!subcommand) return false

			if (subcommand.defer) {
				await interaction.defer()
			}
			return await subcommand.run(interaction)
		}

		console.error(`Command ${command.name} is not a valid command type`)
		console.debug(
			(rawInteraction.data as APIChatInputApplicationCommandInteractionData)
				.options
		)
		return false
	}
}
