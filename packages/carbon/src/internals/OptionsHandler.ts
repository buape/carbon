import {
	type APIApplicationCommandInteractionDataBasicOption,
	type APIApplicationCommandInteractionDataOption,
	type APIAutocompleteApplicationCommandInteractionData,
	type APIChatInputApplicationCommandInteractionData,
	type APIInteractionDataResolved,
	ApplicationCommandOptionType
} from "discord-api-types/v10"
import { Base } from "../abstracts/Base.js"
import {
	type AnyChannel,
	type Client,
	type CommandOptions,
	type ResolvedFile,
	Role,
	User
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
	/**
	 * The resolved data from the interaction.
	 */
	readonly resolved: APIInteractionDataResolved

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
		this.resolved = interactionData.resolved ?? {}
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
	public getUser(key: string, required?: false): User | undefined
	public getUser(key: string, required: true): User
	public getUser(key: string, required = false): User | undefined {
		const id = this.raw.find(
			(x) => x.name === key && x.type === ApplicationCommandOptionType.User
		)?.value
		if (required) {
			if (!id || typeof id !== "string")
				throw new Error(`Missing required option: ${key}`)
		} else if (!id || typeof id !== "string") return undefined

		const user = this.resolved.users?.[id]
		if (!user) {
			throw new Error(
				`Discord failed to resolve user for ${key}, this is a bug.`
			)
		}
		return new User(this.client, user)
	}

	public async getChannelId(
		key: string,
		required?: false
	): Promise<string | undefined>
	public async getChannelId(key: string, required: true): Promise<string>
	public async getChannelId(key: string, required = false) {
		const id = this.raw.find(
			(x) => x.name === key && x.type === ApplicationCommandOptionType.Channel
		)?.value
		if (required) {
			if (!id || typeof id !== "string")
				throw new Error(`Missing required option: ${key}`)
		} else if (!id || typeof id !== "string") return undefined
		return id
	}

	/**
	 * Get the value of a channel option.
	 * @param key The name of the option to get the value of.
	 * @param required Whether the option is required.
	 * @returns The ID of the selected channel, or undefined if the option was not provided and it is not required.
	 */
	public async getChannel(
		key: string,
		required?: false
	): Promise<AnyChannel | undefined>
	public async getChannel(key: string, required: true): Promise<AnyChannel>
	public async getChannel(
		key: string,
		required = false
	): Promise<AnyChannel | undefined> {
		const id = this.raw.find(
			(x) => x.name === key && x.type === ApplicationCommandOptionType.Channel
		)?.value
		if (required) {
			if (!id || typeof id !== "string")
				throw new Error(`Missing required option: ${key}`)
		} else if (!id || typeof id !== "string") return undefined
		return (await this.client.fetchChannel(id)) ?? undefined
	}

	/**
	 * Get the value of a role option.
	 * @param key The name of the option to get the value of.
	 * @param required Whether the option is required.
	 * @returns The value of the option, or undefined if the option was not provided and it is not required.
	 */
	public getRole(key: string, required?: false): Role | undefined
	public getRole(key: string, required: true): Role
	public getRole(key: string, required = false): Role | undefined {
		const id = this.raw.find(
			(x) => x.name === key && x.type === ApplicationCommandOptionType.Role
		)?.value
		if (required) {
			if (!id || typeof id !== "string")
				throw new Error(`Missing required option: ${key}`)
		} else if (!id || typeof id !== "string") return undefined

		const role = this.resolved.roles?.[id]
		if (!role) {
			throw new Error(
				`Discord failed to resolve role for ${key}, this is a bug.`
			)
		}
		return new Role(this.client, role)
	}

	/**
	 * Get the value of a mentionable option.
	 * @param key The name of the option to get the value of.
	 * @param required Whether the option is required.
	 * @returns The value of the option, or undefined if the option was not provided and it is not required.
	 */
	public getMentionable(key: string, required?: false): User | Role | undefined
	public getMentionable(key: string, required: true): User | Role
	public getMentionable(
		key: string,
		required = false
	): User | Role | undefined {
		const id = this.raw.find(
			(x) =>
				x.name === key && x.type === ApplicationCommandOptionType.Mentionable
		)?.value
		if (required) {
			if (!id || typeof id !== "string")
				throw new Error(`Missing required option: ${key}`)
		} else if (!id || typeof id !== "string") return undefined

		// Check if it's a user first
		const user = this.resolved.users?.[id]
		if (user) {
			return new User(this.client, user)
		}

		// Check if it's a role
		const role = this.resolved.roles?.[id]
		if (role) {
			return new Role(this.client, role)
		}

		throw new Error(
			`Discord failed to resolve mentionable for ${key}, this is a bug.`
		)
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
