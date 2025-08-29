import type {
	APIWebhook,
	RESTGetAPIWebhookResult,
	RESTPatchAPIWebhookJSONBody,
	RESTPatchAPIWebhookResult,
	RESTPostAPIWebhookWithTokenResult,
	WebhookType
} from "discord-api-types/v10"
import { Routes } from "discord-api-types/v10"
import { Base } from "../abstracts/Base.js"
import type { Client } from "../classes/Client.js"
import type { IfPartial, MessagePayload } from "../types/index.js"
import { serializePayload } from "../utils/index.js"
import { Message } from "./Message.js"
import { User } from "./User.js"

export type WebhookInput =
	| APIWebhook
	| { id: string; token: string; threadId?: string }
	| string

export class Webhook<IsPartial extends boolean = false> extends Base {
	constructor(client: Client, rawData: APIWebhook)
	constructor(
		client: Client,
		idAndToken: {
			id: string
			token: string
			threadId?: string
		}
	)
	constructor(client: Client, url: string)
	constructor(client: Client, input: WebhookInput)
	constructor(client: Client, input: WebhookInput) {
		super(client)
		if (typeof input === "string") {
			const url = new URL(input)
			if (url.protocol !== "https:") throw new Error("Invalid URL")
			const [id, token] = url.pathname.split("/").slice(2)
			if (!id || !token) throw new Error("Invalid URL")
			this.id = id
			this.token = token
			const potentialThreadId = url.searchParams.get("thread_id")
			this.threadId = potentialThreadId ?? undefined
		} else {
			if ("channel_id" in input) {
				this.setData(input)
			}
			this.id = input.id
			this.token = input.token
			this.threadId = "threadId" in input ? input.threadId : undefined
		}
	}

	protected _rawData: APIWebhook | null = null
	private setData(data: typeof this._rawData) {
		if (!data) throw new Error("Cannot set data without having data... smh")
		this._rawData = data
	}

	/**
	 * The raw Discord API data for this webhook
	 */
	get rawData(): Readonly<APIWebhook> {
		if (!this._rawData)
			throw new Error(
				"Cannot access rawData on partial Webhook. Use fetch() to populate data."
			)
		return this._rawData
	}

	/**
	 * The ID of the webhook
	 */
	readonly id: string

	/**
	 * The token of the webhook
	 */
	readonly token?: string

	/**
	 * The thread ID this webhook is for
	 */
	readonly threadId?: string

	/**
	 * Whether the webhook is a partial webhook (meaning it does not have all the data).
	 * If this is true, you should use {@link Webhook.fetch} to get the full data of the webhook.
	 */
	get partial(): IsPartial {
		return (this._rawData === null) as never
	}

	/**
	 * The type of the webhook
	 * @see https://discord.com/developers/docs/resources/webhook#webhook-object-webhook-types
	 */
	get type(): IfPartial<IsPartial, WebhookType> {
		if (!this._rawData) return undefined as never
		return this._rawData.type
	}

	/**
	 * The guild id this webhook is for
	 */
	get guildId(): IfPartial<IsPartial, string | undefined> {
		if (!this._rawData) return undefined as never
		return this._rawData.guild_id
	}

	/**
	 * The channel id this webhook is for
	 */
	get channelId(): IfPartial<IsPartial, string> {
		if (!this._rawData) return undefined as never
		return this._rawData.channel_id
	}

	/**
	 * The user this webhook was created by
	 * Not returned when getting a webhook with its token
	 */
	get user(): IfPartial<IsPartial, User | undefined> {
		if (!this._rawData?.user) return undefined as never
		return new User(this.client, this._rawData.user)
	}

	/**
	 * The default name of the webhook
	 */
	get name(): IfPartial<IsPartial, string | null> {
		if (!this._rawData) return undefined as never
		return this._rawData.name
	}

	/**
	 * The default avatar of the webhook
	 */
	get avatar(): IfPartial<IsPartial, string | null> {
		if (!this._rawData) return undefined as never
		return this._rawData.avatar
	}

	/**
	 * Get the URL of the webhook's avatar
	 */
	get avatarUrl(): IfPartial<IsPartial, string | null> {
		if (!this._rawData) return undefined as never
		if (!this.avatar) return null
		return `https://cdn.discordapp.com/avatars/${this.id}/${this.avatar}.png`
	}

	/**
	 * The bot/OAuth2 application that created this webhook
	 */
	get applicationId(): IfPartial<IsPartial, string | null> {
		if (!this._rawData) return undefined as never
		return this._rawData.application_id
	}

	/**
	 * The guild of the channel that this webhook is following
	 * Only returned for Channel Follower Webhooks
	 */
	get sourceGuild(): IfPartial<
		IsPartial,
		APIWebhook["source_guild"] | undefined
	> {
		if (!this._rawData) return undefined as never
		return this._rawData.source_guild
	}

	/**
	 * The channel that this webhook is following
	 * Only returned for Channel Follower Webhooks
	 */
	get sourceChannel(): IfPartial<
		IsPartial,
		APIWebhook["source_channel"] | undefined
	> {
		if (!this._rawData) return undefined as never
		return this._rawData.source_channel
	}

	/**
	 * The url used for executing the webhook
	 * Only returned by the webhooks OAuth2 flow
	 */
	get url(): IfPartial<IsPartial, string | undefined> {
		if (!this._rawData) return undefined as never
		return this._rawData.url
	}

	/**
	 * Fetch this webhook's data
	 * @returns A Promise that resolves to a non-partial Webhook
	 */
	async fetch(): Promise<Webhook<false>> {
		const newData = (await this.client.rest.get(
			Routes.webhook(this.id)
		)) as RESTGetAPIWebhookResult
		if (!newData) throw new Error(`Webhook ${this.id} not found`)

		this.setData(newData)

		return this as Webhook<false>
	}

	/**
	 * Modify this webhook
	 * @param data The data to modify the webhook with
	 * @returns A Promise that resolves to the modified webhook
	 */
	async modify(data: RESTPatchAPIWebhookJSONBody): Promise<Webhook<false>> {
		const newData = (await this.client.rest.patch(Routes.webhook(this.id), {
			body: data
		})) as RESTPatchAPIWebhookResult

		this.setData(newData)

		return this as Webhook<false>
	}

	/**
	 * Delete this webhook
	 * @returns A Promise that resolves when the webhook is deleted
	 */
	async delete(): Promise<void> {
		await this.client.rest.delete(Routes.webhook(this.id))
	}

	/**
	 * Send a message through this webhook
	 * @param data The data to send with the webhook
	 * @param threadId Optional ID of the thread to send the message to. If not provided, uses the webhook's thread ID.
	 * @returns A Promise that resolves to the created message
	 */
	async send(data: MessagePayload, threadId?: string): Promise<Message> {
		if (!this.token)
			throw new Error("Cannot send webhook message without token")

		const serialized = serializePayload(data)
		const finalThreadId = threadId || this.threadId
		const message = (await this.client.rest.post(
			Routes.webhook(this.id, this.token),
			{
				body: serialized
			},
			finalThreadId ? { thread_id: finalThreadId } : undefined
		)) as RESTPostAPIWebhookWithTokenResult

		return new Message(this.client, message)
	}

	/**
	 * Edit a message sent by this webhook
	 * @param messageId The ID of the message to edit
	 * @param data The data to edit the message with
	 * @param threadId Optional ID of the thread to edit the message in. If not provided, uses the webhook's thread ID.
	 * @returns A Promise that resolves to the edited message
	 */
	async edit(
		messageId: string,
		data: MessagePayload,
		threadId?: string
	): Promise<Message> {
		if (!this.token)
			throw new Error("Cannot edit webhook message without token")

		const serialized = serializePayload(data)
		const finalThreadId = threadId || this.threadId
		const message = (await this.client.rest.patch(
			Routes.webhookMessage(this.id, this.token, messageId),
			{
				body: serialized
			},
			finalThreadId ? { thread_id: finalThreadId } : undefined
		)) as RESTPostAPIWebhookWithTokenResult

		return new Message(this.client, message)
	}

	/**
	 * Delete a message sent by this webhook
	 * @param messageId The ID of the message to delete
	 * @param threadId Optional ID of the thread to delete the message from. If not provided, uses the webhook's thread ID.
	 * @returns A Promise that resolves when the message is deleted
	 */
	async deleteMessage(messageId: string, threadId?: string): Promise<void> {
		if (!this.token)
			throw new Error("Cannot delete webhook message without token")

		const finalThreadId = threadId || this.threadId
		await this.client.rest.delete(
			Routes.webhookMessage(this.id, this.token, messageId),
			undefined,
			finalThreadId ? { thread_id: finalThreadId } : undefined
		)
	}

	/**
	 * Get a message sent by this webhook
	 * @param messageId The ID of the message to get
	 * @param threadId Optional ID of the thread to get the message from. If not provided, uses the webhook's thread ID.
	 * @returns A Promise that resolves to the message
	 */
	async getMessage(messageId: string, threadId?: string): Promise<Message> {
		if (!this.token) throw new Error("Cannot get webhook message without token")

		const finalThreadId = threadId || this.threadId
		const message = (await this.client.rest.get(
			Routes.webhookMessage(this.id, this.token, messageId),
			finalThreadId ? { thread_id: finalThreadId } : undefined
		)) as RESTPostAPIWebhookWithTokenResult

		return new Message(this.client, message)
	}
}
