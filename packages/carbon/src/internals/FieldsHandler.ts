import { ComponentType } from "discord-api-types/v10"
import { Base } from "../abstracts/Base.js"
import {
	type APIInteractionDataResolved,
	type APIModalSubmitInteraction,
	type AnyChannel,
	type Client,
	type ResolvedFile,
	Role,
	User
} from "../index.js"

/**
 * This class is used to parse the fields of a modal submit interaction.
 * It is used internally by the Modal class.
 */
export class FieldsHandler extends Base {
	/**
	 * The raw data from the interaction.
	 */
	readonly rawData: { [key: string]: string[] } = {}
	/**
	 * The resolved data from the interaction.
	 */
	readonly resolved: APIInteractionDataResolved

	constructor(client: Client, interaction: APIModalSubmitInteraction) {
		super(client)
		this.resolved = interaction.data.resolved ?? {}
		interaction.data.components.map((component) => {
			if (component.type === ComponentType.Label) {
				const subComponent = component.component
				if (subComponent.type === ComponentType.TextInput) {
					this.rawData[subComponent.custom_id] = [subComponent.value]
				} else {
					this.rawData[subComponent.custom_id] = subComponent.values
				}
			}
		})
	}

	/**
	 * Get the value of a text input or text display.
	 * @param key The custom ID of the input or display to get the value of.
	 * @returns The value of the input or display, or undefined if the input or display was not provided.
	 */
	public getText(key: string, required?: false): string | undefined
	public getText(key: string, required: true): string
	public getText(key: string, required = false) {
		const value = this.rawData[key]?.[0]
		if (required) {
			if (!value || typeof value !== "string")
				throw new Error(`Missing required field: ${key}`)
		} else if (!value || typeof value !== "string") return undefined
		return value
	}

	/**
	 * Get the value of a string select.
	 * @param key The custom ID of the select to get the value of.
	 * @param required Whether the select is required.
	 * @returns The value of the select menu, or undefined if the select menu was not provided and it is not required.
	 */
	public getStringSelect(key: string, required?: false): string[] | undefined
	public getStringSelect(key: string, required: true): string[]
	public getStringSelect(key: string, required = false) {
		const value = this.rawData[key]
		if (required) {
			if (!value || !Array.isArray(value))
				throw new Error(`Missing required field: ${key}`)
		} else if (!value || !Array.isArray(value)) return undefined
		return value
	}

	public getChannelSelectIds(
		key: string,
		required?: false
	): string[] | undefined
	public getChannelSelectIds(key: string, required: true): string[]
	public getChannelSelectIds(key: string, required = false) {
		const value = this.rawData[key]
		if (!value || !Array.isArray(value)) {
			if (required) throw new Error(`Missing required field: ${key}`)
			return undefined
		}
		return value
	}

	/**
	 * Get the channels selected in a channel select.
	 * This is async because Discord provides very limited information about the channels so we have to fetch it.
	 * You can use {@link FieldsHandler.getChannelSelectIds} to get the IDs of the selected channels, and that will not be async.
	 * @param key The custom ID of the channel select menu to get the value of.
	 * @param required Whether the channel select menu is required.
	 * @returns The IDs of the selected channels, or undefined if the select menu was not provided and it is not required.
	 */
	public async getChannelSelect(
		key: string,
		required?: false
	): Promise<AnyChannel[] | undefined>
	public async getChannelSelect(
		key: string,
		required: true
	): Promise<AnyChannel[]>
	public async getChannelSelect(key: string, required = false) {
		const value = this.rawData[key]
		if (!value || !Array.isArray(value)) {
			if (required) throw new Error(`Missing required field: ${key}`)
			return undefined
		}
		return await Promise.all(value.map((id) => this.client.fetchChannel(id)))
	}

	/**
	 * Get the users selected in a user select.
	 * @param key The custom ID of the user select menu to get the value of.
	 * @param required Whether the user select menu is required.
	 * @returns The IDs of the selected users, or undefined if the select menu was not provided and it is not required.
	 */
	public getUserSelect(key: string, required?: false): User[] | undefined
	public getUserSelect(key: string, required: true): User[]
	public getUserSelect(key: string, required = false): User[] | undefined {
		const value = this.rawData[key]
		if (!value || !Array.isArray(value)) {
			if (required) throw new Error(`Missing required field: ${key}`)
			return undefined
		}
		const resolved = value.map((id) => this.resolved.users?.[id])
		if (!resolved.every((user) => user !== undefined)) {
			throw new Error(
				`Discord failed to resolve all users for ${key}, this is a bug.`
			)
		}
		return resolved
			.filter((user) => user !== undefined)
			.map((user) => new User(this.client, user))
	}

	public getRoleSelect(key: string, required?: false): Role[] | undefined
	public getRoleSelect(key: string, required: true): Role[]
	public getRoleSelect(key: string, required = false) {
		const value = this.rawData[key]
		if (!value || !Array.isArray(value)) {
			if (required) throw new Error(`Missing required field: ${key}`)
			return undefined
		}
		const resolved = value.map((id) => this.resolved.roles?.[id])
		if (!resolved.every((role) => role !== undefined)) {
			throw new Error(
				`Discord failed to resolve all roles for ${key}, this is a bug.`
			)
		}
		return resolved
			.filter((role) => role !== undefined)
			.map((role) => new Role(this.client, role))
	}

	public getMentionableSelect(
		key: string,
		required?: false
	): { users: User[]; roles: Role[] } | undefined
	public getMentionableSelect(
		key: string,
		required: true
	): { users: User[]; roles: Role[] }
	public getMentionableSelect(key: string, required = false) {
		const value = this.rawData[key]
		if (!value || !Array.isArray(value)) {
			if (required) throw new Error(`Missing required field: ${key}`)
			return undefined
		}
		const resolvedRoles = value.map((id) => this.resolved.roles?.[id])
		const resolvedUsers = value.map((id) => this.resolved.users?.[id])
		const result = {
			roles: resolvedRoles
				.filter((role) => role !== undefined)
				.map((role) => new Role(this.client, role)),
			users: resolvedUsers
				.filter((user) => user !== undefined)
				.map((user) => new User(this.client, user))
		}
		if (result.roles.length + result.users.length !== value.length) {
			throw new Error(
				`Discord failed to resolve all mentionables for ${key}, this is a bug.`
			)
		}
		return result
	}

	public getFile(key: string, required?: false): ResolvedFile[] | undefined
	public getFile(key: string, required: true): ResolvedFile[]
	public getFile(key: string, required = false) {
		const value = this.rawData[key]
		if (!value || !Array.isArray(value)) {
			if (required) throw new Error(`Missing required field: ${key}`)
			return undefined
		}
		const resolved = value.map((id) => this.resolved.attachments?.[id])
		if (!resolved.every((attachment) => attachment !== undefined)) {
			throw new Error(
				`Discord failed to resolve all attachments for ${key}, this is a bug.`
			)
		}
		return resolved.filter((attachment) => attachment !== undefined)
	}
}
