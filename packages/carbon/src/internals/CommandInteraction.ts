import {
	type APIApplicationCommandInteraction,
	type APIChatInputApplicationCommandInteractionData,
	ApplicationCommandType,
	InteractionType
} from "discord-api-types/v10"
import {
	BaseInteraction,
	type InteractionDefaults
} from "../abstracts/BaseInteraction.js"
import type { Client } from "../classes/Client.js"
import type { Command } from "../classes/Command.js"
import { Message } from "../structures/Message.js"
import { User } from "../structures/User.js"
import { OptionsHandler } from "./OptionsHandler.js"
/**
 * Represents a command interaction
 */
export class CommandInteraction extends BaseInteraction<APIApplicationCommandInteraction> {
	/**
	 * This is the options of the commands, parsed from the interaction data.
	 * It will not have any options in it if the command is not a ChatInput command.
	 */
	options: OptionsHandler
	constructor({
		client,
		data,
		defaults,
		processingCommand
	}: {
		client: Client
		data: APIApplicationCommandInteraction
		defaults: InteractionDefaults
		processingCommand?: Command
	}) {
		super(client, data, defaults)
		if (data.type !== InteractionType.ApplicationCommand) {
			throw new Error("Invalid interaction type was used to create this class")
		}
		this.options = new OptionsHandler({
			client,
			options:
				data.data.type === ApplicationCommandType.ChatInput
					? (data.data.options ?? [])
					: [],
			interactionData: this.rawData
				.data as APIChatInputApplicationCommandInteractionData,
			definitions: processingCommand?.options ?? [],
			guildId: data.guild_id
		})
	}

	get targetMessage() {
		const interactionData = this.rawData.data
		if (
			interactionData.type !== ApplicationCommandType.Message ||
			!("resolved" in interactionData)
		) {
			return null
		}

		const { target_id: targetId, resolved } = interactionData
		if (!resolved?.messages) return null

		const rawMessage = targetId
			? resolved.messages[targetId]
			: Object.values(resolved.messages)[0]

		return rawMessage ? new Message(this.client, rawMessage) : null
	}

	get targetUser() {
		const interactionData = this.rawData.data
		if (
			interactionData.type !== ApplicationCommandType.User ||
			!("resolved" in interactionData)
		) {
			return null
		}

		const { target_id: targetId, resolved } = interactionData
		if (!resolved?.users) return null

		const rawUser = targetId
			? resolved.users[targetId]
			: Object.values(resolved.users)[0]

		return rawUser ? new User(this.client, rawUser) : null
	}
}
