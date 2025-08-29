import {
	type APIApplicationCommandInteractionDataBasicOption,
	type APIApplicationCommandInteractionDataOption,
	type APIAutocompleteApplicationCommandInteractionData,
	type APIChannel,
	type APIChatInputApplicationCommandInteractionData,
	ApplicationCommandOptionType,
	Routes
} from "discord-api-types/v10"
import { Base } from "../abstracts/Base.js"
import {
	type Client,
	type CommandOptions,
	type ResolvedFile,
	Role,
	User,
	channelFactory
} from "../index.js"
export type RawOptions = {
	[key: string]:
		| APIApplicationCommandInteractionDataBasicOption["value"]
		| undefined
}

/**
 * This class is used to parse the options of a command, and provide errors for any missing or invalid options.
 * It is used internally by the Command class.
 */
export class OptionsHandler extends Base {
	/**
	 * The raw options that were in the interaction data, before they were parsed.
	 */
	readonly raw: APIApplicationCommandInteractionDataBasicOption[]

	private interactionData?:
		| APIChatInputApplicationCommandInteractionData
		| APIAutocompleteApplicationCommandInteractionData
	private definitions?: CommandOptions

	constructor({
		client,
		options,
		interactionData,
		definitions
	}: {
		client: Client
		options: APIApplicationCommandInteractionDataOption[]
		interactionData:
			| APIChatInputApplicationCommandInteractionData
			| APIAutocompleteApplicationCommandInteractionData
		definitions: CommandOptions
	}) {
		super(client)
		this.raw = []
		this.interactionData = interactionData
		this.definitions = definitions
		for (const option of options) {
			if (option.type === ApplicationCommandOptionType.Subcommand) {
				for (const subOption of option.options ?? []) {
					this.raw.push(subOption)
				}
			} else if (option.type === ApplicationCommandOptionType.SubcommandGroup) {
				for (const subOption of option.options ?? []) {
					if (subOption.options) {
						for (const subSubOption of subOption.options ?? []) {
							this.raw.push(subSubOption)
						}
					}
				}
			} else {
				this.raw.push(option)
			}
		}
	}

	/**
	 * Get the value of a string option.
	 * @param key The name of the option to get the value of.
	 * @param required Whether the option is required.
	 * @returns The value of the option, or undefined if the option was not provided and it is not required.
	 */
	public getString(key: string, required?: false): string | undefined
	public getString(key: string, required: true): string
	public getString(key: string, required = false): string | undefined {
		const value = this.raw.find(
			(x) => x.name === key && x.type === ApplicationCommandOptionType.String
		)?.value
		if (required) {
			if (!value || typeof value !== "string")
				throw new Error(`Missing required option: ${key}`)
		} else if (!value || typeof value !== "string") return undefined
		this.checkAgainstDefinition(key, value)
		return value
	}

	/**
	 * Get the value of an integer option.
	 * @param key The name of the option to get the value of.
	 * @param required Whether the option is required.
	 * @returns The value of the option, or undefined if the option was not provided and it is not required.
	 */
	public getInteger(key: string, required?: false): number | undefined
	public getInteger(key: string, required: true): number
	public getInteger(key: string, required = false): number | undefined {
		const value = this.raw.find(
			(x) => x.name === key && x.type === ApplicationCommandOptionType.Integer
		)?.value
		if (required) {
			if (!value || typeof value !== "number" || !Number.isSafeInteger(value))
				throw new Error(`Missing required option: ${key}`)
		} else if (
			!value ||
			typeof value !== "number" ||
			!Number.isSafeInteger(value)
		)
			return undefined
		this.checkAgainstDefinition(key, value)
		return value
	}

	/**
	 * Get the value of a number option.
	 * @param key The name of the option to get the value of.
	 * @param required Whether the option is required.
	 * @returns The value of the option, or undefined if the option was not provided and it is not required.
	 */
	public getNumber(key: string, required?: false): number | undefined
	public getNumber(key: string, required: true): number
	public getNumber(key: string, required = false): number | undefined {
		const value = this.raw.find(
			(x) => x.name === key && x.type === ApplicationCommandOptionType.Number
		)?.value
		if (required) {
			if (!value || typeof value !== "number")
				throw new Error(`Missing required option: ${key}`)
		} else if (!value || typeof value !== "number") return undefined
		this.checkAgainstDefinition(key, value)
		return value
	}

	/**
	 * Get the value of a boolean option.
	 * @param key The name of the option to get the value of.
	 * @param required Whether the option is required.
	 * @returns The value of the option, or undefined if the option was not provided and it is not required.
	 */
	public getBoolean(key: string, required?: false): boolean | undefined
	public getBoolean(key: string, required: true): boolean
	public getBoolean(key: string, required = false): boolean | undefined {
		const value = this.raw.find(
			(x) => x.name === key && x.type === ApplicationCommandOptionType.Boolean
		)?.value
		if (required) {
			if (!value || typeof value !== "boolean")
				throw new Error(`Missing required option: ${key}`)
		} else if (!value || typeof value !== "boolean") return undefined
		return value
	}

	/**
	 * Get the value of a user option.
	 * @param key The name of the option to get the value of.
	 * @param required Whether the option is required.
	 * @returns The value of the option, or undefined if the option was not provided and it is not required.
	 */
	public getUser(key: string, required?: false): User<true> | undefined
	public getUser(key: string, required: true): User<true>
	public getUser(key: string, required = false): User<true> | undefined {
		const id = this.raw.find(
			(x) => x.name === key && x.type === ApplicationCommandOptionType.User
		)?.value
		if (required) {
			if (!id || typeof id !== "string")
				throw new Error(`Missing required option: ${key}`)
		} else if (!id || typeof id !== "string") return undefined
		return new User<true>(this.client, id)
	}

	/**
	 * Get the value of a channel option.
	 * @param key The name of the option to get the value of.
	 * @param required Whether the option is required.
	 * @returns The value of the option, or undefined if the option was not provided and it is not required.
	 */
	public async getChannel(
		key: string,
		required?: false
	): Promise<ReturnType<typeof channelFactory> | undefined>
	public async getChannel(
		key: string,
		required: true
	): Promise<ReturnType<typeof channelFactory>>
	public async getChannel(
		key: string,
		required = false
	): Promise<ReturnType<typeof channelFactory> | undefined> {
		const id = this.raw.find(
			(x) => x.name === key && x.type === ApplicationCommandOptionType.Channel
		)?.value
		if (required) {
			if (!id || typeof id !== "string")
				throw new Error(`Missing required option: ${key}`)
		} else if (!id || typeof id !== "string") return undefined
		const data = (await this.client.rest.get(Routes.channel(id))) as APIChannel
		return channelFactory(this.client, data)
	}

	/**
	 * Get the value of a role option.
	 * @param key The name of the option to get the value of.
	 * @param required Whether the option is required.
	 * @returns The value of the option, or undefined if the option was not provided and it is not required.
	 */
	public getRole(key: string, required?: false): Role<true> | undefined
	public getRole(key: string, required: true): Role<true>
	public getRole(key: string, required = false): Role<true> | undefined {
		const id = this.raw.find(
			(x) => x.name === key && x.type === ApplicationCommandOptionType.Role
		)?.value
		if (required) {
			if (!id || typeof id !== "string")
				throw new Error(`Missing required option: ${key}`)
		} else if (!id || typeof id !== "string") return undefined
		return new Role<true>(this.client, id)
	}

	/**
	 * Get the value of a mentionable option.
	 * @param key The name of the option to get the value of.
	 * @param required Whether the option is required.
	 * @returns The value of the option, or undefined if the option was not provided and it is not required.
	 */
	public async getMentionable(
		key: string,
		required?: false
	): Promise<User | Role<true> | undefined>
	public async getMentionable(
		key: string,
		required: true
	): Promise<User | Role<true>>
	public async getMentionable(
		key: string,
		required = false
	): Promise<User | Role<true> | undefined> {
		const id = this.raw.find(
			(x) =>
				x.name === key && x.type === ApplicationCommandOptionType.Mentionable
		)?.value
		if (required) {
			if (!id || typeof id !== "string")
				throw new Error(`Missing required option: ${key}`)
		} else if (!id || typeof id !== "string") return undefined

		try {
			const user = new User<true>(this.client, id)
			await user.fetch()
			return user as unknown as User<false>
		} catch {
			return new Role<true>(this.client, id)
		}
	}

	public getAttachment(key: string, required?: false): ResolvedFile | undefined
	public getAttachment(key: string, required: true): ResolvedFile
	public getAttachment(
		key: string,
		required = false
	): ResolvedFile | undefined {
		if (!this.interactionData)
			throw new Error(
				"Interaction data is not available, this is a bug in Carbon."
			)
		const id = this.raw.find(
			(x) =>
				x.name === key && x.type === ApplicationCommandOptionType.Attachment
		)?.value
		if (required) {
			if (!id || typeof id !== "string")
				throw new Error(`Missing required option: ${key}`)
		} else if (!id || typeof id !== "string") return undefined
		const attachment = this.interactionData.resolved?.attachments?.[id]
		if (!attachment) {
			if (required) throw new Error(`Missing required option: ${key}`)
			return undefined
		}
		return attachment
	}

	private checkAgainstDefinition(
		key: string,
		value: string | number | boolean
	) {
		const definition = this.definitions?.find((x) => x.name === key)
		if (!definition) return
		if (
			definition.type === ApplicationCommandOptionType.String &&
			typeof value === "string"
		) {
			if (
				"max_length" in definition &&
				definition.max_length &&
				value.length > definition.max_length
			)
				throw new Error(
					`Invalid length for option ${key}: Should be less than ${definition.max_length} characters but is ${value.length} characters`
				)
			if (
				"min_length" in definition &&
				definition.min_length &&
				value.length < definition.min_length
			)
				throw new Error(
					`Invalid length for option ${key}: Should be more than ${definition.min_length} characters but is ${value.length} characters`
				)
		}
		if (
			(definition.type === ApplicationCommandOptionType.Integer ||
				definition.type === ApplicationCommandOptionType.Number) &&
			typeof value === "number"
		) {
			if (
				"min_value" in definition &&
				definition.min_value &&
				value < definition.min_value
			)
				throw new Error(
					`Invalid value for option ${key}: Should be more than ${definition.min_value} but is ${value}`
				)
			if (
				"max_value" in definition &&
				definition.max_value &&
				value > definition.max_value
			)
				throw new Error(
					`Invalid value for option ${key}: Should be less than ${definition.max_value} but is ${value}`
				)
		}
		if ("choices" in definition && definition.choices) {
			const choice = definition.choices.find((x) => x.value === value)
			if (!choice)
				throw new Error(
					`Invalid choice for option ${key}: Should be one of ${definition.choices?.map((x) => x.value).join(", ")} but is ${value}`
				)
		}
	}
}
