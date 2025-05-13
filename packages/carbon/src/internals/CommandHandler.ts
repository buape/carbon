import {
	type APIApplicationCommandAutocompleteInteraction,
	type APIApplicationCommandInteraction,
	type APIApplicationCommandSubcommandGroupOption,
	ApplicationCommandOptionType,
	ApplicationCommandType
} from "discord-api-types/v10"
import { Base } from "../abstracts/Base.js"
import type { BaseMessageInteractiveComponent } from "../abstracts/BaseMessageInteractiveComponent.js"
import { Command } from "../classes/Command.js"
import { CommandWithSubcommandGroups } from "../classes/CommandWithSubcommandGroups.js"
import { CommandWithSubcommands } from "../classes/CommandWithSubcommands.js"
import { AutocompleteInteraction } from "./AutocompleteInteraction.js"
import { CommandInteraction } from "./CommandInteraction.js"

export class CommandHandler extends Base {
	private getCommand(
		rawInteraction:
			| APIApplicationCommandAutocompleteInteraction
			| APIApplicationCommandInteraction
	): Command {
		let command = this.client.commands.find(
			(x) => x.name === rawInteraction.data.name
		)
		if (!command) command = this.client.commands.find((x) => x.name === "*")
		if (!command) throw new Error("Command not found")

		if (command instanceof CommandWithSubcommandGroups) {
			if (rawInteraction.data.type !== ApplicationCommandType.ChatInput) {
				throw new Error("Subcommand groups must be used with ChatInput")
			}
			const data = rawInteraction.data
			const subcommandGroupName = data.options?.find(
				(x) => x.type === ApplicationCommandOptionType.SubcommandGroup
			)?.name
			if (!subcommandGroupName) throw new Error("No subcommand group name")

			const subcommandGroup = command.subcommandGroups.find(
				(x) => x.name === subcommandGroupName
			)

			if (!subcommandGroup) throw new Error("Subcommand group not found")

			const subcommandName = (
				data.options?.find(
					(x) => x.type === ApplicationCommandOptionType.SubcommandGroup
				) as APIApplicationCommandSubcommandGroupOption
			).options?.find(
				(x) => x.type === ApplicationCommandOptionType.Subcommand
			)?.name
			if (!subcommandName) throw new Error("No subcommand name")

			const subcommand = subcommandGroup.subcommands.find(
				(x) => x.name === subcommandName
			)

			if (!subcommand) throw new Error("Subcommand not found")

			return subcommand
		}

		if (command instanceof CommandWithSubcommands) {
			if (rawInteraction.data.type !== ApplicationCommandType.ChatInput) {
				throw new Error("Subcommands must be used with ChatInput")
			}
			const data = rawInteraction.data
			const subcommand = command.subcommands.find(
				(x) => x.name === data.options?.[0]?.name
			)
			if (!subcommand) throw new Error("Subcommand not found")

			return subcommand
		}

		if (command instanceof Command) {
			return command
		}

		throw new Error("Command is not a valid command type")
	}
	/**
	 * Handle a command interaction
	 * @internal
	 */
	async handleCommandInteraction(
		rawInteraction: APIApplicationCommandInteraction
	) {
		const command = this.getCommand(rawInteraction)
		if (!command) return false

		if (command.components) {
			for (const component of command.components as BaseMessageInteractiveComponent[]) {
				this.client.componentHandler.registerComponent(component)
			}
		}

		const interaction = new CommandInteraction({
			client: this.client,
			data: rawInteraction,
			defaults: {
				ephemeral: command.ephemeral
			},
			processingCommand: command
		})

		try {
			const command = this.getCommand(rawInteraction)

			if (command.defer) {
				await interaction.defer()
			}
			if (command.preCheck) {
				const result = await command.preCheck(interaction)
				if (!result) return false
			}
			return await command.run(interaction)
		} catch (e: unknown) {
			if (e instanceof Error) console.error(e.message)
			console.error(e)
		}
	}
	async handleAutocompleteInteraction(
		rawInteraction: APIApplicationCommandAutocompleteInteraction
	) {
		const command = this.getCommand(rawInteraction)
		if (!command) return false

		const interaction = new AutocompleteInteraction({
			client: this.client,
			data: rawInteraction,
			defaults: {
				ephemeral: command.ephemeral
			},
			processingCommand: command
		})

		try {
			const command = this.getCommand(rawInteraction)
			return await command.autocomplete(interaction)
		} catch (e: unknown) {
			if (e instanceof Error) console.error(e.message)
			console.error(e)
		}
	}
}
