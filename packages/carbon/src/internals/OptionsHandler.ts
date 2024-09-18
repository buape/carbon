import {
	type APIApplicationCommandInteractionDataBasicOption,
	type APIApplicationCommandInteractionDataOption,
	type APIChannel,
	ApplicationCommandOptionType,
	Routes
} from "discord-api-types/v10"
import { Base } from "../abstracts/Base.js"
import { type Client, Role, User, channelFactory } from "../index.js"

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

	constructor(
		client: Client,
		options: APIApplicationCommandInteractionDataOption[]
	) {
		super(client)
		this.raw = []
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
		return new User(this.client, id)
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
		return new Role(this.client, id)
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
	): Promise<User | Role | undefined>
	public async getMentionable(key: string, required: true): Promise<User | Role>
	public async getMentionable(
		key: string,
		required = false
	): Promise<User | Role | undefined> {
		const id = this.raw.find(
			(x) =>
				x.name === key && x.type === ApplicationCommandOptionType.Mentionable
		)?.value
		if (required) {
			if (!id || typeof id !== "string")
				throw new Error(`Missing required option: ${key}`)
		} else if (!id || typeof id !== "string") return undefined

		try {
			const user = new User(this.client, id)
			await user.fetch()
			return user
		} catch {
			return new Role(this.client, id)
		}
	}
}
