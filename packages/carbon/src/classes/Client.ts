import { RequestClient, type RequestClientOptions } from "@buape/carbon-request"
import {
	type APIChannel,
	type APIGuild,
	type APIGuildMember,
	type APIInteraction,
	type APIRole,
	type APIUser,
	InteractionResponseType,
	InteractionType,
	Routes
} from "discord-api-types/v10"
import type { BaseCommand } from "../abstracts/BaseCommand.js"
import type { Context, Plugin, Route } from "../abstracts/Plugin.js"
import { channelFactory } from "../factories/channelFactory.js"
import { CommandHandler } from "../internals/CommandHandler.js"
import { ComponentHandler } from "../internals/ComponentHandler.js"
import { ModalHandler } from "../internals/ModalHandler.js"
import { Guild } from "../structures/Guild.js"
import { GuildMember } from "../structures/GuildMember.js"
import { Role } from "../structures/Role.js"
import { User } from "../structures/User.js"
import { concatUint8Arrays, subtleCrypto, valueToUint8Array } from "../utils.js"

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
	 */
	publicKey: string
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
	 * Whether components and modals should not be registered automatically.
	 * If you want you register components yourself (e.g. you are changing them at runtime), you can manually call {@link ComponentHandler#registerComponent} and {@link ModalHandler#registerModal} on the client.
	 * @default false
	 */
	disableAutoRegister?: boolean
	/**
	 * Whether the deploy route should be disabled.
	 * @default false
	 */
	disableDeployRoute?: boolean
	/**
	 * Whether the interactions route should
	 * @default false
	 */
	disableInteractionsRoute?: boolean
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
	plugins: Plugin[] = []
	/**
	 * The options used to initialize the client
	 */
	options: ClientOptions
	/**
	 * The commands that the client has registered
	 */
	commands: BaseCommand[]
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
	 * Creates a new client
	 * @param options The options used to initialize the client
	 * @param commands The commands that the client has registered
	 * @param plugins The plugins that the client should use
	 */
	constructor(
		options: ClientOptions,
		commands: BaseCommand[],
		plugins: Plugin[] = []
	) {
		if (!options.clientId) throw new Error("Missing client ID")
		if (!options.publicKey) throw new Error("Missing public key")
		if (!options.token) throw new Error("Missing token")
		if (!options.deploySecret && !options.disableDeployRoute)
			throw new Error("Missing deploy secret")

		this.options = options
		this.commands = commands

		// Remove trailing slashes from the base URL
		options.baseUrl = options.baseUrl.replace(/\/+$/, "")

		this.commandHandler = new CommandHandler(this)
		this.componentHandler = new ComponentHandler(this)
		this.modalHandler = new ModalHandler(this)

		this.rest = new RequestClient(options.token, options.requestOptions)

		this.appendRoutes()
		for (const plugin of plugins) {
			plugin.registerClient?.(this)
			plugin.registerRoutes?.(this)
			this.plugins.push(plugin)
		}

		if (!options.disableAutoRegister) {
			for (const command of commands) {
				for (const component of command.components)
					this.componentHandler.registerComponent(new component())
				for (const modal of command.modals)
					this.modalHandler.registerModal(new modal())
			}
		}
		if (options.autoDeploy) {
			this.handleDeployRequest()
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
	}

	/**
	 * Handle a request to deploy the commands to Discord
	 * @returns A response
	 */
	public async handleDeployRequest() {
		const commands = this.commands
			.filter((c) => c.name !== "*")
			.map((c) => c.serialize())
		await this.rest.put(
			Routes.applicationCommands(this.options.clientId), //
			{ body: commands }
		)
		return new Response("OK", { status: 202 })
	}

	/**
	 * Handle an interaction request from Discord
	 * @param req The request to handle
	 * @param ctx The context for the request
	 * @returns A response
	 */
	public async handleInteractionsRequest(req: Request, ctx: Context) {
		const isValid = await this.validateInteractionRequest(req)
		if (!isValid) return new Response("Unauthorized", { status: 401 })

		const interaction = (await req.json()) as APIInteraction

		if (interaction.type === InteractionType.Ping) {
			return Response.json({ type: InteractionResponseType.Pong })
		}

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

		return new Response("OK", { status: 202 })
	}

	/**
	 * Validate the interaction request
	 * @param req The request to validate
	 */
	private async validateInteractionRequest(req: Request) {
		const body = await req.clone().text()
		const signature = req.headers.get("X-Signature-Ed25519")
		const timestamp = req.headers.get("X-Signature-Timestamp")
		if (!timestamp || !signature || req.method !== "POST" || !body) return false

		try {
			const timestampData = valueToUint8Array(timestamp)
			const bodyData = valueToUint8Array(body)
			const message = concatUint8Arrays(timestampData, bodyData)
			const isValid = await subtleCrypto.verify(
				{
					name: "ed25519"
				},
				await subtleCrypto.importKey(
					"raw",
					valueToUint8Array(this.options.publicKey, "hex"),
					{
						name: "ed25519",
						namedCurve: "ed25519"
					},
					false,
					["verify"]
				),
				valueToUint8Array(signature, "hex"),
				message
			)
			return isValid
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
	 * @param id The ID of the role to fetch
	 * @returns The role data
	 */
	async fetchRole(guildId: string, id: string) {
		const role = (await this.rest.get(Routes.guildRole(guildId, id))) as APIRole
		return new Role(this, role)
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

	// ======================== End Fetchers ================================================
}

/**
 * @hidden
 */
export interface ExecutionContext {
	// biome-ignore lint/suspicious/noExplicitAny: true any
	waitUntil(promise: Promise<any>): void
}
