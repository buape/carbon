import {
	type APIApplicationCommandInteractionDataOption,
	type APIInteraction,
	type APIMessage,
	type APIUser,
	ApplicationCommandOptionType,
	ApplicationCommandType,
	type Client,
	ComponentType,
	InteractionType,
	TextInputStyle
} from "@buape/carbon"
import type { FakeDiscord } from "./fakeDiscord.js"
import type { CarbonTestRecorder } from "./recorder.js"
import { generateSnowflake } from "./snowflake.js"

const testCommandId = generateSnowflake({ increment: 101 })
const testUserId = generateSnowflake({ increment: 102 })
const testBotId = generateSnowflake({ increment: 103 })
const testGuildId = generateSnowflake({ increment: 104 })
const testChannelId = generateSnowflake({ increment: 105 })
const testMessageId = generateSnowflake({ increment: 106 })
const testInteractionId = generateSnowflake({ increment: 107 })

import type {
	AutocompleteInteractionOptions,
	CommandInteractionOptions,
	ComponentInteractionOptions,
	IdInput,
	InteractionRunResult,
	ModalSubmitOptions,
	RecordedResponse,
	TestUser
} from "./types.js"

export class InteractionTestRunner {
	constructor(
		private readonly client: Client,
		private readonly discord: FakeDiscord,
		private readonly recorder: CarbonTestRecorder
	) {}

	async command(name: string, options: CommandInteractionOptions = {}) {
		const interaction = this.commandInteraction(name, false, options)
		return await this.run(interaction)
	}

	async autocomplete(
		name: string,
		options: AutocompleteInteractionOptions = {}
	) {
		const interaction = this.commandInteraction(name, true, options)
		return await this.run(interaction)
	}

	async component(options: ComponentInteractionOptions = {}) {
		const interaction = this.componentInteraction(options)
		return await this.run(interaction)
	}

	async modal(
		customId: string,
		fields: Record<string, string | string[] | boolean> = {},
		options: ModalSubmitOptions = {}
	) {
		const interaction = this.modalInteraction({ ...options, customId, fields })
		return await this.run(interaction)
	}

	async run(interaction: APIInteraction): Promise<InteractionRunResult> {
		const eventIndex = this.recorder.events.length
		const callIndex = this.discord.calls.length
		await this.client.handleInteraction(interaction, {})
		return this.result(interaction, eventIndex, callIndex)
	}

	private result(
		interaction: APIInteraction,
		eventIndex: number,
		callIndex: number
	): InteractionRunResult {
		const responses = this.recorder.responsesSince(eventIndex)
		const calls = this.discord.calls.slice(callIndex)
		const reply = responses.find((response) =>
			["reply", "edit-original", "update"].includes(response.kind)
		)
		const message = this.messageFromResponses(responses)
		return {
			interaction,
			responses,
			calls,
			reply,
			deferred: responses.some((response) => response.kind === "defer"),
			message,
			followups: this.followupsFromCalls(calls),
			click: async (customId, options = {}) =>
				await this.component({
					...options,
					customId,
					message: options.message ?? message
				}),
			submitModal: async (customId, fields = {}, options = {}) =>
				await this.modal(customId ?? this.latestModalId(responses), fields, {
					...options,
					message: options.message ?? message
				})
		}
	}

	private commandInteraction(
		name: string,
		autocomplete: boolean,
		options: CommandInteractionOptions & { focused?: string }
	): APIInteraction {
		const user = this.user(options.user)
		const guildId = this.id(options.guild, testGuildId)
		const channelId = this.id(options.channel, testChannelId)
		if (!this.discord.users.has(user.id)) this.discord.addUser(user)
		if (channelId && !this.discord.channels.has(channelId))
			this.discord.addChannel({ id: channelId, guild_id: guildId ?? undefined })
		const command = this.client.commands.find(
			(candidate) => candidate.name === name
		)
		const data = {
			id: options.id ?? testCommandId,
			name,
			type: command?.type ?? ApplicationCommandType.ChatInput,
			options: this.options(options.options, options.focused),
			resolved: options.resolved
		}
		return {
			id: options.id ?? this.id(undefined, testInteractionId),
			application_id: this.client.options.clientId,
			type: autocomplete
				? InteractionType.ApplicationCommandAutocomplete
				: InteractionType.ApplicationCommand,
			data,
			guild_id: guildId ?? undefined,
			channel_id: channelId ?? undefined,
			channel: channelId ? this.discord.channels.get(channelId) : undefined,
			member: guildId ? { user, roles: [], ...options.member } : undefined,
			user: guildId ? undefined : user,
			token: options.token ?? this.id(undefined, "token"),
			version: 1
		} as APIInteraction
	}

	private componentInteraction(
		options: ComponentInteractionOptions
	): APIInteraction {
		const message = options.message ?? this.discord.latestMessage()
		const customId =
			options.customId ?? this.findCustomId(message) ?? "component"
		const componentType =
			options.componentType ??
			this.findComponentType(message, customId) ??
			ComponentType.Button
		const user = this.user(options.user)
		const messageGuildId = this.messageGuildId(message)
		const guildId = this.id(options.guild, messageGuildId ?? testGuildId)
		const channelId = this.id(
			options.channel,
			message?.channel_id ?? testChannelId
		)
		const data = {
			custom_id: customId,
			component_type: componentType,
			values: options.values
		}
		return {
			id: this.id(undefined, testInteractionId),
			application_id: this.client.options.clientId,
			type: InteractionType.MessageComponent,
			data,
			message: message ?? this.blankMessage(channelId ?? testChannelId),
			guild_id: guildId ?? undefined,
			channel_id: channelId ?? undefined,
			channel: channelId ? this.discord.channels.get(channelId) : undefined,
			member: guildId ? { user, roles: [] } : undefined,
			user: guildId ? undefined : user,
			token: this.id(undefined, "token"),
			version: 1
		} as APIInteraction
	}

	private modalInteraction(options: ModalSubmitOptions): APIInteraction {
		const message = options.message ?? this.discord.latestMessage()
		const user = this.user(options.user)
		const messageGuildId = this.messageGuildId(message)
		const guildId = this.id(options.guild, messageGuildId ?? testGuildId)
		const channelId = this.id(
			options.channel,
			message?.channel_id ?? testChannelId
		)
		return {
			id: this.id(undefined, testInteractionId),
			application_id: this.client.options.clientId,
			type: InteractionType.ModalSubmit,
			data: {
				custom_id: options.customId ?? "modal",
				components: this.modalFields(options.fields ?? {}),
				resolved: options.resolved
			},
			message,
			guild_id: guildId ?? undefined,
			channel_id: channelId ?? undefined,
			channel: channelId ? this.discord.channels.get(channelId) : undefined,
			member: guildId ? { user, roles: [] } : undefined,
			user: guildId ? undefined : user,
			token: this.id(undefined, "token"),
			version: 1
		} as unknown as APIInteraction
	}

	private options(
		options: CommandInteractionOptions["options"],
		focused?: string
	): APIApplicationCommandInteractionDataOption[] | undefined {
		if (!options) return undefined
		if (Array.isArray(options)) return options
		return Object.entries(options).map(([name, value]) => ({
			name,
			focused: focused === name ? true : undefined,
			type:
				typeof value === "boolean"
					? ApplicationCommandOptionType.Boolean
					: typeof value === "number"
						? ApplicationCommandOptionType.Number
						: ApplicationCommandOptionType.String,
			value
		})) as APIApplicationCommandInteractionDataOption[]
	}

	private modalFields(fields: Record<string, string | string[] | boolean>) {
		return Object.entries(fields).map(([customId, value]) => ({
			type: ComponentType.Label,
			label: customId,
			component: Array.isArray(value)
				? {
						type: ComponentType.StringSelect,
						custom_id: customId,
						values: value
					}
				: {
						type: ComponentType.TextInput,
						custom_id: customId,
						value: String(value),
						style: TextInputStyle.Short
					}
		}))
	}

	private user(input?: IdInput | TestUser): APIUser {
		if (!input)
			return (
				this.discord.users.get(testUserId) ??
				this.discord.addUser({ id: testUserId })
			)
		if (typeof input === "string")
			return (
				this.discord.users.get(input) ?? this.discord.addUser({ id: input })
			)
		if ("username" in input || "global_name" in input || "bot" in input)
			return this.discord.addUser(input)
		return (
			this.discord.users.get(input.id) ?? this.discord.addUser({ id: input.id })
		)
	}

	private id(input: IdInput | null | undefined, fallback: string) {
		if (input === null) return null
		if (!input) return fallback
		return typeof input === "string" ? input : input.id
	}

	private messageGuildId(message?: APIMessage) {
		return message
			? (
					this.discord.channels.get(message.channel_id) as
						| { guild_id?: string }
						| undefined
				)?.guild_id
			: undefined
	}

	private findCustomId(message?: APIMessage) {
		return this.walk(message?.components).find(
			(item) => typeof item.custom_id === "string"
		)?.custom_id as string | undefined
	}

	private findComponentType(message: APIMessage | undefined, customId: string) {
		return this.walk(message?.components).find(
			(item) => item.custom_id === customId
		)?.type as ComponentType | undefined
	}

	private walk(value: unknown): Record<string, unknown>[] {
		if (!value || typeof value !== "object") return []
		if (Array.isArray(value)) return value.flatMap((item) => this.walk(item))
		const record = value as Record<string, unknown>
		return [record, ...Object.values(record).flatMap((item) => this.walk(item))]
	}

	private latestModalId(responses: RecordedResponse[]) {
		const modal = [...responses]
			.reverse()
			.find((response) => response.kind === "modal")?.body as
			| { data?: { custom_id?: string } }
			| undefined
		return modal?.data?.custom_id ?? "modal"
	}

	private messageFromResponses(_responses: RecordedResponse[]) {
		return (
			[...this.discord.interactionMessages.values()].at(-1) ??
			[...this.discord.messages.values()].at(-1)
		)
	}

	private followupsFromCalls(calls: { path: string; method: string }[]) {
		const followupCalls = calls.filter(
			(call) =>
				call.method === "POST" && /^\/webhooks\/[^/]+\/[^/]+$/.test(call.path)
		)
		return [...this.discord.messages.values()].slice(-followupCalls.length)
	}

	private blankMessage(channelId: string): APIMessage {
		return {
			id: testMessageId,
			channel_id: channelId,
			author: this.user(testBotId),
			content: "",
			timestamp: new Date().toISOString(),
			edited_timestamp: null,
			tts: false,
			mention_everyone: false,
			mentions: [],
			mention_roles: [],
			attachments: [],
			embeds: [],
			pinned: false,
			type: 0
		} as APIMessage
	}
}
