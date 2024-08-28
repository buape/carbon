import { Base } from "./Base.js"
import {
	type APIApplicationCommandSubcommandGroupOption,
	type APIChatInputApplicationCommandInteractionData,
	ApplicationCommandOptionType,
	ApplicationCommandType,
	type APIApplicationCommandInteraction
} from "discord-api-types/v10"
import { Command } from "../classes/Command.js"
import { CommandWithSubcommandGroups } from "../classes/CommandWithSubcommandGroups.js"
import { CommandWithSubcommands } from "../classes/CommandWithSubcommands.js"
import { CommandInteraction } from "./CommandInteraction.js"

export class CommandHandler extends Base {
	async handleInteraction(rawInteraction: APIApplicationCommandInteraction) {
		const command = this.client.commands.find(
			(x) => x.name === rawInteraction.data.name
		)
		if (!command) return false
		console.log("a")

		const interaction = new CommandInteraction(
			this.client,
			rawInteraction,
			command
		)

		console.log("b")

		if (command instanceof Command) {
			console.log("c")
			if (command.defer) {
				console.log("d")
				await interaction.defer()
			}
			console.log("e")
			return await command.run(interaction)
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
		console.log(
			(rawInteraction.data as APIChatInputApplicationCommandInteractionData)
				.options
		)
		return false
	}
}
