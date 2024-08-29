import {
	type APIApplicationCommandInteraction,
	type APIApplicationCommandInteractionDataBasicOption,
	ApplicationCommandOptionType,
	ApplicationCommandType,
	InteractionType
} from "discord-api-types/v10"
import type { Client } from "../classes/Client.js"
import { Command } from "../classes/Command.js"
import type { BaseCommand } from "./BaseCommand.js"
import { BaseInteraction } from "./BaseInteraction.js"

/**
 * Represents a command interaction
 */
export class CommandInteraction extends BaseInteraction {
	options: {
		[key: string]:
			| APIApplicationCommandInteractionDataBasicOption["value"]
			| undefined
	} = {}
	constructor(
		client: Client,
		data: APIApplicationCommandInteraction,
		command?: BaseCommand
	) {
		super(client, data)
		if (data.type !== InteractionType.ApplicationCommand) {
			throw new Error("Invalid interaction type was used to create this class")
		}
		if (data.data.type !== ApplicationCommandType.ChatInput) {
			throw new Error("Invalid command type was used to create this class")
		}
		if (
			command &&
			command instanceof Command &&
			data.data.type === ApplicationCommandType.ChatInput
		) {
			this.options = this.parseOptions(
				command,
				(data.data.options ??
					[]) as APIApplicationCommandInteractionDataBasicOption[]
			)
		}
	}

	private parseOptions = (
		command: Command,
		options: APIApplicationCommandInteractionDataBasicOption[]
	) => {
		const result: {
			[key: string]: (typeof options)[number]["value"] | undefined
		} = {}
		for (const option of options) {
			const optionData = command.options?.find((x) => x.name === option.name)
			if (!optionData) {
				result[option.name] = undefined
			} else {
				switch (optionData.type) {
					case ApplicationCommandOptionType.String:
						result[option.name] = option.value as string
						break
					case ApplicationCommandOptionType.Integer:
						result[option.name] = option.value as number
						break
					case ApplicationCommandOptionType.Boolean:
						result[option.name] = option.value as boolean
						break
					case ApplicationCommandOptionType.User:
						result[option.name] = option.value as string
						break
					case ApplicationCommandOptionType.Channel:
						result[option.name] = option.value as string
						break
					case ApplicationCommandOptionType.Role:
						result[option.name] = option.value as string
						break
					case ApplicationCommandOptionType.Mentionable:
						result[option.name] = option.value as string
						break
				}
			}
		}
		return result
	}
}
