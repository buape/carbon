import {
	type APIChannel,
	type APIGuild,
	type APIGuildMember,
	type APIInteraction,
	type APIMessage,
	type APIRole,
	type APIUser,
	type APIWebhookEvent,
	ApplicationWebhookType,
	InteractionResponseType,
	InteractionType,
	Routes
} from "discord-api-types/v10"
import type { BaseCommand } from "../abstracts/BaseCommand.js"
import type { BaseListener } from "../abstracts/BaseListener.js"
import type { BaseMessageInteractiveComponent } from "../abstracts/BaseMessageInteractiveComponent.js"
import type { Context, Plugin, Route } from "../abstracts/Plugin.js"
import { channelFactory } from "../functions/channelFactory.js"
import { CommandHandler } from "../internals/CommandHandler.js"
import { ComponentHandler } from "../internals/ComponentHandler.js"
import { EmojiHandler } from "../internals/EmojiHandler.js"
import { EventHandler } from "../internals/EventHandler.js"
import type { EventQueueOptions } from "../internals/EventQueue.js"
import { ModalHandler } from "../internals/ModalHandler.js"
import { TemporaryListenerManager } from "../internals/TemporaryListenerManager.js"
import { Guild } from "../structures/Guild.js"
import { GuildMember } from "../structures/GuildMember.js"
import { Message } from "../structures/Message.js"
import { Role } from "../structures/Role.js"
import { User } from "../structures/User.js"
import { Webhook, type WebhookInput } from "../structures/Webhook.js"
import {
	concatUint8Arrays,
	subtleCrypto,
	valueToUint8Array
} from "../utils/index.js"
import { RequestClient, type RequestClientOptions } from "./RequestClient.js"

type SerializedCommand = ReturnType<BaseCommand["serialize"]>

/**
 * The options used for initializing the client
 */
export interface ClientOptions {
	/**
	 * The base URL of the app
	 */
	baseUrl: string
	/**
	 * The client ID of the app
	 */
	clientId: string
	/**
	 * The deploy secret of the app, used for protecting the deploy route
	 */
	deploySecret?: string
	/**
	 * The public key of the app, used for interaction verification
	 * Can be a single key or an array of keys
	 */
	publicKey: string | string[]
	/**
	 * The token of the bot
	 */
	token: string
	/**
	 * The options used to initialize the request client, if you want to customize it.
	 */
	requestOptions?: RequestClientOptions
	/**
	 * Whether the commands should be deployed to Discord automatically.
	 * @default false
	 */
	autoDeploy?: boolean
	/**
	 * Whether the deploy route should be disabled.
	 * @default false
	 */
	disableDeployRoute?: boolean
	/**
	 * Whether the interactions route should be disabled
	 * @default false
	 */
	disableInteractionsRoute?: boolean
	/**
	 * Whether the events route should be disabled
	 * @default false
	 */
	disableEventsRoute?: boolean
	/**
	 * A list of guild IDs to deploy all commands to during development (guild command deployment is instant and rate-limited higher).
	 * If set, all commands will be deployed to these guilds instead of globally.
	 */
	devGuilds?: string[]
	/**
	 * Configuration for the event queue worker pool
	 */
	eventQueue?: EventQueueOptions
}

/**
 * The main client used to interact with Discord
 */
export class Client {
	/**
	 * The routes that the client will handle
	 */
	routes: Route[] = []
	/**
	 * The plugins that the client has registered
	 */
	plugins: { id: string; plugin: Plugin }[] = []
	/**
	 * The options used to initialize the client
	 */
	options: ClientOptions
	/**
	 * The commands that the client has registered
	 */
	commands: BaseCommand[]
	/**
	 * The event listeners that the client has registered
	 */
	listeners: BaseListener[] = []
	/**
	 * The components that the client has globally registered
	 */
	components: BaseMessageInteractiveComponent[] = []
	/**
	 * The rest client used to interact with the Discord API
	 */
	rest: RequestClient
	/**
	 * The handler for the component interactions sent from Discord
	 * @internal
	 */
	componentHandler: ComponentHandler
	/**
	 * The handler for the modal interactions sent from Discord
	 * @internal
	 */
	commandHandler: CommandHandler
	/**
	 * The handler for the modal interactions sent from Discord
	 * @internal
	 */
	modalHandler: ModalHandler
	/**
	 * The handler for events sent from Discord
	 * @internal
	 */
	eventHandler: EventHandler
	/**
	 * The manager for temporary event listeners with automatic cleanup
	 */
	temporaryListeners: TemporaryListenerManager
	/**
	 * The handler for application emojis for this application
	 */
	emoji: EmojiHandler

	/**
	 * The ID of the shard this client is running on, if sharding is enabled
	 */
	shardId?: number
	/**
	 * The total number of shards, if sharding is enabled
	 */
	totalShards?: number

	/**
	 * Creates a new client
	 * @param options The options used to initialize the client
	 * @param handlers The handlers that the client has registered
	 * @param plugins The plugins that the client should use
	 */
	constructor(
		options: ClientOptions,
		handlers: {
			commands?: BaseCommand[]
			listeners?: BaseListener[]
			components?: BaseMessageInteractiveComponent[]
		},
		plugins: Plugin[] = []
	) {
		if (!options.clientId) throw new Error("Missing client ID")
		if (!options.publicKey) throw new Error("Missing public key")
		if (!options.token) throw new Error("Missing token")
		if (!options.deploySecret && !options.disableDeployRoute)
			throw new Error("Missing deploy secret")

		this.options = options
		this.commands = handlers.commands ?? []
		this.listeners = handlers.listeners ?? []
		this.components = handlers.components ?? []

		// Remove trailing slashes from the base URL
		options.baseUrl = options.baseUrl.replace(/\/+$/, "")

		this.commandHandler = new CommandHandler(this)
		this.componentHandler = new ComponentHandler(this)
		this.modalHandler = new ModalHandler(this)
		this.eventHandler = new EventHandler(this)
		this.temporaryListeners = new TemporaryListenerManager(this)
		this.emoji = new EmojiHandler(this)

		for (const component of this.components) {
			this.componentHandler.registerComponent(component)
		}
		for (const command of this.commands) {
			for (const component of command.components ?? []) {
				this.componentHandler.registerComponent(component)
			}
		}

		this.rest = new RequestClient(options.token, options.requestOptions)

		this.appendRoutes()
		for (const plugin of plugins) {
			plugin.registerClient?.(this)
			plugin.registerRoutes?.(this)
			this.plugins.push({ id: plugin.id, plugin })
		}

		if (options.autoDeploy) {
			this.handleDeployRequest()
		}
	}

	public getPlugin<T extends Plugin>(id: string): T | undefined {
		return this.plugins.find((p) => p.id === id)?.plugin as T | undefined
	}

	private appendRoutes() {
		this.routes.push({
			method: "GET",
			path: "/deploy",
			handler: this.handleDeployRequest.bind(this),
			protected: true,
			disabled: this.options.disableDeployRoute
		})
		this.routes.push({
			method: "POST",
			path: "/interactions",
			handler: this.handleInteractionsRequest.bind(this),
			disabled: this.options.disableInteractionsRoute
		})
		this.routes.push({
			method: "POST",
			path: "/events",
			handler: this.handleEventsRequest.bind(this),
			disabled: this.options.disableEventsRoute
		})
	}

	/**
	 * Handle a request to deploy the commands to Discord
	 * @returns A response
	 */
	public async handleDeployRequest() {
		const commands = this.commands.filter((c) => c.name !== "*")
		const globalCommands = commands.filter((c) => !c.guildIds)
		const guildCommandsMap: Record<string, SerializedCommand[]> = {}
		for (const command of commands) {
			if (command.guildIds) {
				for (const guildId of command.guildIds) {
					if (!guildCommandsMap[guildId]) guildCommandsMap[guildId] = []
					guildCommandsMap[guildId].push(command.serialize())
				}
			}
		}

		// If devGuilds is set, deploy all commands to those guilds (for development)
		if (this.options.devGuilds && this.options.devGuilds.length > 0) {
			for (const guildId of this.options.devGuilds) {
				await this.rest.put(
					Routes.applicationGuildCommands(this.options.clientId, guildId),
					{ body: commands.map((c) => c.serialize()) }
				)
			}
			return new Response("OK (devGuilds)", { status: 202 })
		}

		// Deploy guild-specific commands
		for (const [guildId, cmds] of Object.entries(guildCommandsMap)) {
			await this.rest.put(
				Routes.applicationGuildCommands(this.options.clientId, guildId),
				{ body: cmds }
			)
		}

		// Deploy global commands
		if (globalCommands.length > 0) {
			await this.rest.put(Routes.applicationCommands(this.options.clientId), {
				body: globalCommands.map((c) => c.serialize())
			})
		}
		return new Response("OK", { status: 202 })
	}

	/**
	 * Handle an interaction request from Discord
	 * @param req The request to handle
	 * @returns A response
	 */
	public async handleEventsRequest(req: Request) {
		const isValid = await this.validateDiscordRequest(req)
		if (!isValid) return new Response("Unauthorized", { status: 401 })

		const payload = (await req.json()) as APIWebhookEvent

		if (payload.type === ApplicationWebhookType.Ping)
			return new Response(null, { status: 204 })

		const enqueued = this.eventHandler.handleEvent(
			{ ...payload.event.data, clientId: this.options.clientId },
			payload.event.type
		)

		if (!enqueued) {
			return new Response("Event queue full, retry later", { status: 429 })
		}

		return new Response(null, { status: 204 })
	}

	/**
	 * Handle an interaction request from Discord
	 * @param req The request to handle
	 * @param ctx The context for the request
	 * @returns A response
	 */
	public async handleInteractionsRequest(req: Request, ctx: Context) {
		const isValid = await this.validateDiscordRequest(req)
		if (!isValid) return new Response("Unauthorized", { status: 401 })

		const interaction = (await req.json()) as APIInteraction

		if (interaction.type === InteractionType.Ping) {
			return Response.json({ type: InteractionResponseType.Pong })
		}

		await this.handleInteraction(interaction, ctx)
		return new Response("OK", { status: 202 })
	}

	/**
	 * Handle an interaction request from Discord
	 * @param interaction The interaction to handle
	 * @param ctx The context for the request
	 * @returns A response
	 */
	public async handleInteraction(interaction: APIInteraction, ctx: Context) {
		if (interaction.type === InteractionType.ApplicationCommand) {
			const promise = this.commandHandler.handleCommandInteraction(interaction)
			if (ctx?.waitUntil) ctx.waitUntil(promise)
			else await promise
		}

		if (interaction.type === InteractionType.ApplicationCommandAutocomplete) {
			const promise =
				this.commandHandler.handleAutocompleteInteraction(interaction)
			if (ctx?.waitUntil) ctx.waitUntil(promise)
			else await promise
		}

		if (interaction.type === InteractionType.MessageComponent) {
			const promise = this.componentHandler.handleInteraction(interaction)
			if (ctx?.waitUntil) ctx.waitUntil(promise)
			else await promise
		}

		if (interaction.type === InteractionType.ModalSubmit) {
			const promise = this.modalHandler.handleInteraction(interaction)
			if (ctx?.waitUntil) ctx.waitUntil(promise)
			else await promise
		}
	}

	/**
	 * Validate a request from Discord
	 * @param req The request to validate
	 */
	protected async validateDiscordRequest(req: Request) {
		const body = await req.clone().text()
		const signature = req.headers.get("X-Signature-Ed25519")
		const timestamp = req.headers.get("X-Signature-Timestamp")
		if (!timestamp || !signature || req.method !== "POST" || !body) return false

		try {
			const timestampData = valueToUint8Array(timestamp)
			const bodyData = valueToUint8Array(body)
			const message = concatUint8Arrays(timestampData, bodyData)

			// Convert single key to array for consistent handling
			const publicKeys = Array.isArray(this.options.publicKey)
				? this.options.publicKey
				: [this.options.publicKey]

			// Try each public key until one works
			for (const publicKey of publicKeys) {
				try {
					const publicKeyBuffer = valueToUint8Array(publicKey, "hex")
					const signatureBuffer = valueToUint8Array(signature, "hex")

					// Create proper ArrayBuffer for Web Crypto API
					const publicKeyArrayBuffer = new ArrayBuffer(publicKeyBuffer.length)
					new Uint8Array(publicKeyArrayBuffer).set(publicKeyBuffer)

					const signatureArrayBuffer = new ArrayBuffer(signatureBuffer.length)
					new Uint8Array(signatureArrayBuffer).set(signatureBuffer)

					const messageArrayBuffer = new ArrayBuffer(message.length)
					new Uint8Array(messageArrayBuffer).set(message)

					const isValid = await subtleCrypto.verify(
						{
							name: "ed25519"
						},
						await subtleCrypto.importKey(
							"raw",
							publicKeyArrayBuffer,
							{
								name: "ed25519",
								namedCurve: "ed25519"
							},
							false,
							["verify"]
						),
						signatureArrayBuffer,
						messageArrayBuffer
					)
					if (isValid) return true
				} catch {
					// Skip to next key if this one fails
				}
			}
			return false
		} catch (_) {
			return false
		}
	}

	// ======================== Begin Fetchers ================================================

	/**
	 * Fetch a user from the Discord API
	 * @param id The ID of the user to fetch
	 * @returns The user data
	 */
	async fetchUser(id: string) {
		const user = (await this.rest.get(Routes.user(id))) as APIUser
		return new User(this, user)
	}

	/**
	 * Fetch a guild from the Discord API
	 * @param id The ID of the guild to fetch
	 * @returns The guild data
	 */
	async fetchGuild(id: string) {
		const guild = (await this.rest.get(Routes.guild(id))) as APIGuild
		return new Guild(this, guild)
	}

	/**
	 * Fetch a channel from the Discord API
	 * @param id The ID of the channel to fetch
	 * @returns The channel data
	 */
	async fetchChannel(id: string) {
		const channel = (await this.rest.get(Routes.channel(id))) as APIChannel
		return channelFactory(this, channel)
	}

	/**
	 * Fetch a role from the Discord API
	 * @param guildId The ID of the guild the role is in
	 * @param id The ID of the role to fetch
	 * @returns The role data
	 */
	async fetchRole(guildId: string, id: string) {
		const role = (await this.rest.get(Routes.guildRole(guildId, id))) as APIRole
		return new Role(this, role, guildId)
	}

	/**
	 * Fetch a member from the Discord API
	 * @param guildId The ID of the guild the member is in
	 * @param id The ID of the member to fetch
	 * @returns The member data
	 */
	async fetchMember(guildId: string, id: string) {
		const member = (await this.rest.get(
			Routes.guildMember(guildId, id)
		)) as APIGuildMember
		return new GuildMember(this, member, new Guild<true>(this, guildId))
	}

	/**
	 * Fetch a message from the Discord API
	 * @param channelId The ID of the channel the message is in
	 * @param messageId The ID of the message to fetch
	 * @returns The message data
	 */
	async fetchMessage(channelId: string, messageId: string) {
		const message = (await this.rest.get(
			Routes.channelMessage(channelId, messageId)
		)) as APIMessage
		return new Message(this, message)
	}

	/**
	 * Fetch a webhook from the Discord API
	 * @param input The webhook data, ID and token, or webhook URL
	 * @returns The webhook data
	 */
	async fetchWebhook(input: WebhookInput) {
		const webhook = new Webhook(input)
		return webhook.fetch()
	}

	// ======================== End Fetchers ================================================
}

/**
 * @hidden
 */
export interface ExecutionContext {
	// biome-ignore lint/suspicious/noExplicitAny: true any
	waitUntil(promise: Promise<any>): void
}
