import {
	type APIApplicationCommandInteractionDataBasicOption,
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
	/**
	 * The errors that were encountered while parsing the options.
	 */
	readonly errors: Array<string> = []

	constructor(
		client: Client,
		options: APIApplicationCommandInteractionDataBasicOption[]
	) {
		super(client)
		this.raw = options
	}

	/**
	 * Get the value of a string option.
	 * @param key The name of the option to get the value of.
	 * @returns The value of the option, or undefined if the option was not provided.
	 */
	public getString(key: string) {
		const value = this.raw.find(
			(x) => x.name === key && x.type === ApplicationCommandOptionType.String
		)?.value
		if (!value || typeof value !== "string") return undefined
		return value
	}

	/**
	 * Get the value of an integer option.
	 * @param key The name of the option to get the value of.
	 * @returns The value of the option, or undefined if the option was not provided.
	 */
	public getInteger(key: string) {
		const num = this.raw.find(
			(x) => x.name === key && x.type === ApplicationCommandOptionType.Integer
		)?.value
		if (!num || !Number.isSafeInteger(num)) return undefined
		return num
	}

	/**
	 * Get the value of a number option.
	 * @param key The name of the option to get the value of.
	 * @returns The value of the option, or undefined if the option was not provided.
	 */
	public getNumber(key: string) {
		const value = this.raw.find(
			(x) => x.name === key && x.type === ApplicationCommandOptionType.Number
		)?.value
		if (!value || typeof value !== "number") return undefined
		return value
	}

	/**
	 * Get the value of a boolean option.
	 * @param key The name of the option to get the value of.
	 * @returns The value of the option, or undefined if the option was not provided.
	 */
	public getBoolean(key: string) {
		const value = this.raw.find(
			(x) => x.name === key && x.type === ApplicationCommandOptionType.Boolean
		)?.value
		if (!value || typeof value !== "boolean") return undefined
		return value
	}

	/**
	 * Get the value of a user option.
	 * @param key The name of the option to get the value of.
	 * @returns The value of the option, or undefined if the option was not provided.
	 */
	public getUser(key: string) {
		const id = this.raw.find(
			(x) => x.name === key && x.type === ApplicationCommandOptionType.User
		)?.value
		if (!id || typeof id !== "string") return undefined
		return new User(this.client, id)
	}

	/**
	 * Get the value of a channel option.
	 * @param key The name of the option to get the value of.
	 * @returns The value of the option, or undefined if the option was not provided.
	 */
	public async getChannel(key: string) {
		const id = this.raw.find(
			(x) => x.name === key && x.type === ApplicationCommandOptionType.Channel
		)?.value
		if (!id || typeof id !== "string") return undefined
		const data = (await this.client.rest.get(Routes.channel(id))) as APIChannel
		return channelFactory(this.client, data)
	}

	/**
	 * Get the value of a role option.
	 * @param key The name of the option to get the value of.
	 * @returns The value of the option, or undefined if the option was not provided.
	 */
	public getRole(key: string): Role | undefined {
		const id = this.raw.find(
			(x) => x.name === key && x.type === ApplicationCommandOptionType.Role
		)?.value
		if (!id || typeof id !== "string") return undefined
		return new Role(this.client, id)
	}

	/**
	 * Get the value of a mentionable option.
	 * @param key The name of the option to get the value of.
	 * @returns The value of the option, or undefined if the option was not provided.
	 */
	public async getMentionable(key: string): Promise<User | Role | undefined> {
		const id = this.raw.find(
			(x) =>
				x.name === key && x.type === ApplicationCommandOptionType.Mentionable
		)?.value
		if (!id || typeof id !== "string") return undefined
		const user = new User(this.client, id)
		await user.fetch().catch(() => {
			return new Role(this.client, id)
		})
		return user
	}
}
