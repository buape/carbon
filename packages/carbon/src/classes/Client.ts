import {
	type APIApplicationCommand,
	type APIChannel,
	type APIGuild,
	type APIGuildMember,
	type APIInteraction,
	type APIMessage,
	type APIRole,
	type APIUser,
	type APIWebhookEvent,
	ApplicationCommandType,
	ApplicationWebhookType,
	InteractionResponseType,
	InteractionType,
	Routes
} from "discord-api-types/v10"
import type { BaseCommand } from "../abstracts/BaseCommand.js"
import type { AnyListener } from "../abstracts/BaseListener.js"
import type { BaseMessageInteractiveComponent } from "../abstracts/BaseMessageInteractiveComponent.js"
import type { Context, Plugin, Route } from "../abstracts/Plugin.js"
import { CacheManager } from "../cache/index.js"
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
import type { CommandMiddleware } from "../types/commandMiddleware.js"
import type {
	ApplicationId,
	ApplicationIdLike,
	BrandedAPIApplicationCommand,
	ChannelIdLike,
	GuildIdLike,
	MessageIdLike,
	RoleIdLike,
	UserIdLike
} from "../types/index.js"
import type {
	CarbonFetch,
	CarbonTestHookDisposer,
	CarbonTestHooks
} from "../types/testHooks.js"
import {
	concatUint8Arrays,
	deriveClientIdFromBotToken,
	subtleCrypto,
	valueToUint8Array
} from "../utils/index.js"
import type { Modal } from "./Modal.js"
import {
	RequestClient,
	type RequestClientOptions,
	type RuntimeProfile
} from "./RequestClient.js"

/**
 * @deprecated Use string[] for additional public keys. The string form will be removed in the next major version.
 */
export type LegacyPublicKey = string

/**
 * The options used for initializing the client
 */
export interface ClientOptions {
	/**
	 * The base URL of the app
	 */
	baseUrl: string
	/**
	 * The client ID of the app.
	 * @deprecated Will be removed in the next major version.
	 */
	clientId?: ApplicationIdLike
	/**
	 * The deploy secret of the app, used for protecting the deploy route
	 */
	deploySecret?: string
	/**
	 * Public key configuration used for interaction verification.
	 * Omit this to let Carbon fetch the app public key on boot.
	 * Passing an array supports additional public keys, such as forwarders.
	 */
	publicKey?: LegacyPublicKey | string[]
	/**
	 * The token of the bot
	 */
	token: string
	/**
	 * Runtime profile for Carbon core scheduling defaults.
	 *
	 * @default "serverless"
	 */
	runtimeProfile?: RuntimeProfile
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
	 * The strategy to use when deploying global commands.
	 * Guild and dev-guild deployments always use Discord's bulk overwrite route.
	 *
	 * @default "overwrite"
	 */
	commandDeploymentMode?: "overwrite" | "reconcile"
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
	devGuilds?: GuildIdLike[]
	/**
	 * Configuration for the event queue worker pool
	 */
	eventQueue?: EventQueueOptions
	/**
	 * Middleware hooks that run around every command execution.
	 *
	 * These run before per-command middlewares.
	 */
	commandMiddlewares?: CommandMiddleware[]
	/**
	 * Hooks used by Carbon testing utilities to observe handler behavior.
	 */
	testHooks?: CarbonTestHooks
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
	 * The resolved client ID for this application.
	 */
	clientId: ApplicationId
	/**
	 * The resolved public key configuration for this application.
	 */
	publicKey?: LegacyPublicKey | string[]
	/**
	 * The commands that the client has registered
	 */
	commands: BaseCommand[]
	/**
	 * Registered global middleware hooks for command execution.
	 */
	commandMiddlewares: CommandMiddleware[]
	/**
	 * The event listeners that the client has registered
	 */
	listeners: AnyListener[] = []
	/**
	 * The rest client used to interact with the Discord API
	 */
	rest: RequestClient
	/**
	 * Resolves once Carbon has fetched any boot-time application metadata.
	 */
	readonly ready: Promise<void>
	/**
	 * Opt-in entity cache manager.
	 */
	cache: CacheManager
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
	private cachedGlobalCommands: BrandedAPIApplicationCommand[] | null = null

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
			listeners?: AnyListener[]
			components?: BaseMessageInteractiveComponent[]
			modals?: Modal[]
		},
		plugins: Plugin[] = []
	) {
		if (!options.token) throw new Error("Missing token")
		if (!options.deploySecret && !options.disableDeployRoute)
			throw new Error("Missing deploy secret")

		const clientId =
			options.clientId ?? deriveClientIdFromBotToken(options.token)
		const runtimeProfile = options.runtimeProfile ?? "serverless"
		this.clientId = clientId as ApplicationId
		this.publicKey = options.publicKey
		this.options = {
			...options,
			clientId,
			runtimeProfile,
			eventQueue: {
				runtimeProfile,
				...options.eventQueue
			}
		}

		if (options.clientId) {
			console.warn(
				"[Carbon] Passing clientId is deprecated and will be removed in the next major version. Omit clientId to derive it from the bot token."
			)
		}
		if (typeof options.publicKey === "string") {
			console.warn(
				"[Carbon] Passing publicKey as a string is deprecated and will be removed in the next major version. Omit publicKey to fetch the app public key, or pass string[] for additional forwarder public keys."
			)
		}
		this.commands = handlers.commands ?? []
		this.commandMiddlewares = options.commandMiddlewares ?? []
		this.listeners = handlers.listeners ?? []
		this.cache = CacheManager.disabled()

		// Remove trailing slashes from the base URL
		this.options.baseUrl = this.options.baseUrl.replace(/\/+$/, "")

		this.commandHandler = new CommandHandler(this)
		this.componentHandler = new ComponentHandler(this)
		this.modalHandler = new ModalHandler(this)
		this.eventHandler = new EventHandler(this)
		this.temporaryListeners = new TemporaryListenerManager(this)
		this.emoji = new EmojiHandler(this)

		for (const component of handlers.components ?? []) {
			this.componentHandler.registerComponent(component)
		}
		for (const command of this.commands) {
			for (const component of command.components ?? []) {
				this.componentHandler.registerComponent(component)
			}
		}
		for (const modal of handlers.modals ?? []) {
			this.modalHandler.registerModal(modal)
		}

		this.rest = new RequestClient(this.options.token, {
			runtimeProfile,
			testHooks: this.options.testHooks,
			...this.options.requestOptions
		})
		this.ready = this.initializeApplication()
		void this.ready.catch((error) => {
			console.error("[Carbon] Failed to initialize client", error)
		})

		this.appendRoutes()
		for (const plugin of plugins) {
			plugin.registerClient?.(this)
			plugin.registerRoutes?.(this)
			this.plugins.push({ id: plugin.id, plugin })
		}

		if (this.options.autoDeploy) {
			void this.ready
				.then(() => this.deployCommands())
				.catch((error) => {
					console.error("[Carbon] Failed to auto-deploy commands", error)
				})
		}
	}

	protected async initializeApplication() {
		if (typeof this.publicKey === "string") return

		const application = (await this.rest.get(Routes.currentApplication())) as {
			public_key?: string
			verify_key?: string
		}
		const publicKey = application.public_key ?? application.verify_key
		if (!publicKey) {
			throw new Error("Discord application did not return a public key")
		}

		this.publicKey = Array.isArray(this.publicKey)
			? [publicKey, ...this.publicKey]
			: publicKey
		this.options.publicKey = this.publicKey
	}

	public getPlugin<T extends Plugin>(id: string): T | undefined {
		return this.plugins.find((p) => p.id === id)?.plugin as T | undefined
	}

	public setCache(cache: CacheManager): void {
		this.cache = cache
	}

	public useTestHooks(hooks: CarbonTestHooks): CarbonTestHookDisposer {
		const previousHooks = this.options.testHooks
		this.options.testHooks = hooks
		const disposeRestHooks = this.rest.useTestHooks(hooks)
		return () => {
			this.options.testHooks = previousHooks
			disposeRestHooks()
		}
	}

	public useDiscordFetch(fetch: CarbonFetch): CarbonTestHookDisposer {
		return this.rest.useFetch(fetch)
	}

	public getRuntimeMetrics() {
		const forwarderPlugin = this.getPlugin<
			Plugin & {
				getDeliveryMetrics?: () => unknown
			}
		>("gateway-forwarder")

		return {
			request: this.rest.getSchedulerMetrics(),
			events: this.eventHandler.getMetrics(),
			forwarder:
				typeof forwarderPlugin?.getDeliveryMetrics === "function"
					? forwarderPlugin.getDeliveryMetrics()
					: null
		}
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
	public async handleDeployRequest(req?: Request) {
		let mode: "overwrite" | "reconcile" | undefined
		if (req) {
			const value = new URL(req.url).searchParams.get("mode")
			if (value === "overwrite" || value === "reconcile") {
				mode = value
			}
		}
		const result = await this.deployCommands({ mode })

		if (result.usedDevGuilds) {
			return new Response("OK (devGuilds)", { status: 202 })
		}

		return new Response("OK", { status: 202 })
	}

	public async deployCommands(
		options: { mode?: "overwrite" | "reconcile" } = {}
	) {
		const commands = this.commands.filter((c) => c.name !== "*")
		const globalCommands = commands.filter((c) => !c.guildIds)
		const guildCommandsMap: Record<
			string,
			ReturnType<BaseCommand["serialize"]>[]
		> = {}
		const mode =
			options.mode ?? this.options.commandDeploymentMode ?? "overwrite"

		for (const command of commands) {
			if (command.guildIds) {
				for (const guildId of command.guildIds) {
					if (!guildCommandsMap[guildId]) guildCommandsMap[guildId] = []
					guildCommandsMap[guildId].push(command.serialize())
				}
			}
		}

		// If devGuilds is set, deploy all non-entry-point commands to those guilds (for development)
		if (this.options.devGuilds && this.options.devGuilds.length > 0) {
			const devGuildCommands = commands.filter(
				(command) => command.type !== ApplicationCommandType.PrimaryEntryPoint
			)
			for (const guildId of this.options.devGuilds) {
				const deployed = (await this.rest.put(
					Routes.applicationGuildCommands(this.clientId, guildId),
					{ body: devGuildCommands.map((c) => c.serialize()) }
				)) as APIApplicationCommand[]
				this.updateCommandIdsFromDeployment(deployed)
			}

			const primaryEntryPointCommands = commands.filter(
				(command) => command.type === ApplicationCommandType.PrimaryEntryPoint
			)
			if (primaryEntryPointCommands.length > 0) {
				const deployed = (await this.rest.put(
					Routes.applicationCommands(this.clientId),
					{
						body: primaryEntryPointCommands.map((command) =>
							command.serialize()
						)
					}
				)) as APIApplicationCommand[]
				this.updateCommandIdsFromDeployment(deployed)
				this.cachedGlobalCommands = deployed as BrandedAPIApplicationCommand[]
			}

			return {
				mode,
				usedDevGuilds: true
			}
		}

		// Deploy guild-specific commands
		for (const [guildId, cmds] of Object.entries(guildCommandsMap)) {
			const deployed = (await this.rest.put(
				Routes.applicationGuildCommands(this.clientId, guildId),
				{ body: cmds }
			)) as APIApplicationCommand[]
			this.updateCommandIdsFromDeployment(deployed)
		}

		// Deploy global commands
		if (mode === "reconcile") {
			await this.reconcileGlobalCommands(globalCommands)
		} else if (globalCommands.length > 0) {
			const deployed = (await this.rest.put(
				Routes.applicationCommands(this.clientId),
				{
					body: globalCommands.map((c) => c.serialize())
				}
			)) as APIApplicationCommand[]
			this.updateCommandIdsFromDeployment(deployed)
			this.cachedGlobalCommands = deployed as BrandedAPIApplicationCommand[]
		}

		return {
			mode,
			usedDevGuilds: false
		}
	}

	public async reconcileCommands() {
		return await this.deployCommands({ mode: "reconcile" })
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
			{ ...(payload.event.data ?? {}), clientId: this.clientId },
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
			await this.ready
			const timestampData = valueToUint8Array(timestamp)
			const bodyData = valueToUint8Array(body)
			const message = concatUint8Arrays(timestampData, bodyData)

			// Convert single key to array for consistent handling
			const publicKeys = (
				Array.isArray(this.publicKey) ? this.publicKey : [this.publicKey]
			).filter((publicKey) => typeof publicKey === "string")

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

	/**
	 * Register an event listener with the client.
	 * This method provides type-safe listener registration without requiring
	 * manual type casting at the call site.
	 * @param listener The listener to register
	 */
	registerListener<T extends AnyListener>(listener: T): void {
		this.listeners.push(listener)
	}

	// ======================== Begin Fetchers ================================================

	/**
	 * Fetch a user from the Discord API
	 * @param id The ID of the user to fetch
	 * @param force Whether to bypass cache and request fresh data from Discord
	 * @returns The user data
	 */
	async fetchUser(id: UserIdLike, force: boolean = false) {
		const cached = force ? undefined : await this.cache.users.get(id)
		if (cached) return new User(this, cached)
		const user = (await this.rest.get(Routes.user(id))) as APIUser
		return new User(this, user)
	}

	/**
	 * Fetch a guild from the Discord API
	 * @param id The ID of the guild to fetch
	 * @param force Whether to bypass cache and request fresh data from Discord
	 * @returns The guild data
	 */
	async fetchGuild(id: GuildIdLike, force: boolean = false) {
		const cached = force ? undefined : await this.cache.guilds.get(id)
		if (cached) return new Guild(this, cached)
		const guild = (await this.rest.get(Routes.guild(id))) as APIGuild
		return new Guild(this, guild)
	}

	/**
	 * Fetch a channel from the Discord API
	 * @param id The ID of the channel to fetch
	 * @param force Whether to bypass cache and request fresh data from Discord
	 * @returns The channel data
	 */
	async fetchChannel(id: ChannelIdLike, force: boolean = false) {
		const cached = force ? undefined : await this.cache.channels.get(id)
		if (cached) return channelFactory(this, cached)
		const channel = (await this.rest.get(Routes.channel(id))) as APIChannel
		await this.cache.channels.set(id, channel)
		return channelFactory(this, channel)
	}

	/**
	 * Fetch a role from the Discord API
	 * @param guildId The ID of the guild the role is in
	 * @param id The ID of the role to fetch
	 * @param force Whether to bypass cache and request fresh data from Discord
	 * @returns The role data
	 */
	async fetchRole(
		guildId: GuildIdLike,
		id: RoleIdLike,
		force: boolean = false
	) {
		const key = `${guildId}:${id}`
		const cached = force ? undefined : await this.cache.roles.get(key)
		if (cached) return new Role(this, cached, guildId)
		const role = (await this.rest.get(Routes.guildRole(guildId, id))) as APIRole
		return new Role(this, role, guildId)
	}

	/**
	 * Fetch a member from the Discord API
	 * @param guildId The ID of the guild the member is in
	 * @param id The ID of the member to fetch
	 * @param force Whether to bypass cache and request fresh data from Discord
	 * @returns The member data
	 */
	async fetchMember(
		guildId: GuildIdLike,
		id: UserIdLike,
		force: boolean = false
	) {
		const key = `${guildId}:${id}`
		const cached = force ? undefined : await this.cache.members.get(key)
		if (cached)
			return new GuildMember(this, cached, new Guild<true>(this, guildId))
		const member = (await this.rest.get(
			Routes.guildMember(guildId, id)
		)) as APIGuildMember
		return new GuildMember(this, member, new Guild<true>(this, guildId))
	}

	/**
	 * Fetch a message from the Discord API
	 * @param channelId The ID of the channel the message is in
	 * @param messageId The ID of the message to fetch
	 * @param force Whether to bypass cache and request fresh data from Discord
	 * @returns The message data
	 */
	async fetchMessage(
		channelId: ChannelIdLike,
		messageId: MessageIdLike,
		force: boolean = false
	) {
		const key = `${channelId}:${messageId}`
		const cached = force ? undefined : await this.cache.messages.get(key)
		if (cached) return new Message(this, cached)
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

	public async getDiscordCommands(force = false) {
		if (!force && this.cachedGlobalCommands) {
			return this.cachedGlobalCommands
		}
		const commands = (await this.rest.get(
			Routes.applicationCommands(this.clientId)
		)) as APIApplicationCommand[]
		const brandedCommands = commands as BrandedAPIApplicationCommand[]
		this.cachedGlobalCommands = brandedCommands
		this.updateCommandIdsFromDeployment(commands)
		return brandedCommands
	}

	private updateCommandIdsFromDeployment(commands: APIApplicationCommand[]) {
		for (const deployed of commands) {
			const match = this.commands.find((command) => {
				if (command.name !== deployed.name) return false
				if (command.type !== deployed.type) return false
				if (deployed.guild_id) {
					if (!command.guildIds || command.guildIds.length === 0) return true
					return command.guildIds.includes(deployed.guild_id as GuildIdLike)
				}
				return !command.guildIds || command.guildIds.length === 0
			})

			if (match) {
				match.id = deployed.id as BrandedAPIApplicationCommand["id"]
			}
		}
	}

	private async reconcileGlobalCommands(commands: BaseCommand[]) {
		const discordCommandResponseOnlyFields = new Set([
			"application_id",
			"description_localized",
			"dm_permission",
			"guild_id",
			"id",
			"name_localized",
			"nsfw",
			"version"
		])
		const discordSubcommandOnlyFields = new Set([
			"description_localizations",
			"integration_types",
			"contexts",
			"default_member_permissions",
			"name_localizations"
		])
		const discordUnorderedArrayFields = new Set([
			"channel_types",
			"contexts",
			"integration_types"
		])
		const normalizeCommandDefinitionValue = (
			value: unknown,
			path: string[] = []
		): unknown => {
			if (Array.isArray(value)) {
				const normalized = value.map((entry) =>
					normalizeCommandDefinitionValue(entry, path)
				)
				const key = path.at(-1)
				if (
					key &&
					discordUnorderedArrayFields.has(key) &&
					normalized.every(
						(entry) =>
							typeof entry === "string" ||
							typeof entry === "number" ||
							typeof entry === "boolean"
					)
				) {
					return [...normalized].sort()
				}
				return normalized
			}

			if (value && typeof value === "object") {
				const normalizedEntries = Object.entries(
					value as Record<string, unknown>
				).flatMap(([key, entry]) => {
					if (
						path.includes("options") &&
						discordSubcommandOnlyFields.has(key)
					) {
						return []
					}
					if (
						(key === "required" || key === "autocomplete") &&
						entry === false
					) {
						return []
					}

					const normalized = normalizeCommandDefinitionValue(entry, [
						...path,
						key
					])
					if (normalized === undefined) {
						return []
					}

					return [[key, normalized] as const]
				})

				return Object.fromEntries(
					normalizedEntries.sort(([left], [right]) => left.localeCompare(right))
				)
			}

			return value
		}
		const normalizeLiveCommandDefinition = (command: APIApplicationCommand) => {
			const body = Object.fromEntries(
				Object.entries(
					command as APIApplicationCommand & Record<string, unknown>
				).filter(([key]) => !discordCommandResponseOnlyFields.has(key))
			)
			return normalizeCommandDefinitionValue(body)
		}

		const liveCommands = (await this.rest.get(
			Routes.applicationCommands(this.clientId)
		)) as APIApplicationCommand[]
		const liveByKey = new Map(
			liveCommands.map((command) => [
				`${command.type}:${command.name}`,
				command
			])
		)
		const desiredCommands = commands.map((command) => ({
			body: command.serialize(),
			key: `${command.type}:${command.name}`
		}))
		const desiredKeys = new Set(desiredCommands.map((command) => command.key))

		for (const live of liveCommands) {
			const key = `${live.type}:${live.name}`
			if (desiredKeys.has(key)) {
				continue
			}

			await this.rest.delete(Routes.applicationCommand(this.clientId, live.id))
			liveByKey.delete(key)
		}

		for (const desired of desiredCommands) {
			const existing = liveByKey.get(desired.key)
			if (!existing) continue
			if (
				JSON.stringify(normalizeLiveCommandDefinition(existing)) ===
				JSON.stringify(normalizeCommandDefinitionValue(desired.body))
			) {
				continue
			}

			const updated = (await this.rest.patch(
				Routes.applicationCommand(this.clientId, existing.id),
				{ body: desired.body }
			)) as APIApplicationCommand
			liveByKey.set(desired.key, updated)
		}

		for (const desired of desiredCommands) {
			if (liveByKey.has(desired.key)) continue

			const created = (await this.rest.post(
				Routes.applicationCommands(this.clientId),
				{ body: desired.body }
			)) as APIApplicationCommand
			liveByKey.set(desired.key, created)
		}

		const deployed = desiredCommands
			.map((desired) => liveByKey.get(desired.key))
			.filter((command): command is APIApplicationCommand => Boolean(command))
		this.cachedGlobalCommands = deployed as BrandedAPIApplicationCommand[]
		this.updateCommandIdsFromDeployment(deployed)
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
