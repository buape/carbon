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
import { AutoRouter, type IRequestStrict, StatusError, json } from "itty-router"
import type { BaseCommand } from "../abstracts/BaseCommand.js"
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
 * The mode that the client is running in.
 * Different platforms have different requirements for how processes are handled.
 */
export enum ClientMode {
	NodeJS = "node",
	CloudflareWorkers = "cloudflare",
	Bun = "bun",
	Vercel = "vercel",
	Web = "web"
}

/**
 * The options used for initializing the client
 */
export type ClientOptions = {
	/**
	 * If you want to have the root route for the interaction handler redirect to a different URL, you can set this.
	 */
	redirectUrl?: string
	/**
	 * The client ID of the bot
	 */
	clientId: string
	/**
	 * The public key of the bot, used for interaction verification
	 */
	publicKey: string
	/**
	 * The token of the bot
	 */
	token: string
	/**
	 * The mode of the client, generally where you are hosting the bot. If you have a different mode for your local development, make sure to set it to the local one.
	 * @example
	 * ```ts
	 * import { Client, ClientMode } from "@buape/carbon"
	 *
	 * const client = new Client({
	 * 	clientId: "12345678901234567890",
	 * 	publicKey: "c1a2f941ae8ce6d776f7704d0bb3d46b863e21fda491cdb2bdba6b8bc5fe7269",
	 * 	token: "MTA4NjEwNTYxMDUxMDE1NTg1Nw.GNt-U8.OSHy-g-5FlfESnu3Z9MEEMJLHiRthXajiXNwiE",
	 * 	mode: process.env.NODE_ENV === "development" ? ClientMode.NodeJS : ClientMode.CloudflareWorkers
	 * })
	 * ```
	 */
	mode: ClientMode
	/**
	 * The route to use for interactions on your server.
	 * @default "/interaction"
	 */
	interactionRoute?: string
	/**
	 * The options used to initialize the request client, if you want to customize it.
	 */
	requestOptions?: RequestClientOptions
	/**
	 * The port to run the server on, if you are using {@link ClientMode.Bun} mode.
	 */
	port?: number
	/**
	 * Whether the commands should be deployed to Discord automatically.
	 */
	autoDeploy?: boolean
	/**
	 * Whether components and modals should be registered automatically.
	 * If you don't want to do this (e.g. you are changing them at runtime), you can manually call {@link ComponentHandler#registerComponent} and {@link ModalHandler#registerModal} on the client.
	 */
	autoRegister?: boolean
}

/**
 * The main client used to interact with Discord
 */
export class Client {
	/**
	 * The options used to initialize the client
	 */
	options: ClientOptions
	/**
	 * The commands that the client has registered
	 */
	commands: BaseCommand[]
	/**
	 * The router used to handle requests
	 */
	router: ReturnType<typeof AutoRouter<IRequestStrict>>
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
	 */
	constructor(options: ClientOptions, commands: BaseCommand[]) {
		if (!options.clientId) throw new Error("Missing client ID")
		if (!options.publicKey) throw new Error("Missing public key")
		if (!options.token) throw new Error("Missing token")

		this.options = options
		this.commands = commands

		this.commandHandler = new CommandHandler(this)
		this.componentHandler = new ComponentHandler(this)
		this.modalHandler = new ModalHandler(this)

		const routerData =
			this.options.mode === ClientMode.Bun && this.options.port
				? { port: this.options.port }
				: {}
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		this.router = AutoRouter<IRequestStrict, any[], Response>(routerData)
		this.rest = new RequestClient(options.token, options.requestOptions)

		if (this.options.autoRegister) {
			for (const command of commands) {
				for (const component of command.components)
					this.componentHandler.registerComponent(new component())
				for (const modal of command.modals)
					this.modalHandler.registerModal(new modal())
			}
		}
		if (this.options.autoDeploy) this.deployCommands()
		this.setupRoutes()
	}

	/**
	 * Deploy the commands registered to Discord.
	 * This is automatically called when running in NodeJS mode.
	 */
	async deployCommands() {
		try {
			const commands = this.commands
				.filter((x) => x.name !== "*")
				.map((command) => {
					return command.serialize()
				})
			await this.rest.put(Routes.applicationCommands(this.options.clientId), {
				body: commands
			})
			console.log(`Deployed ${commands.length} commands to Discord`)
		} catch (err) {
			console.error("Failed to deploy commands")
			console.error(err)
		}
	}

	/**
	 * Setup the routes for the client
	 */
	private setupRoutes() {
		this.router.get("/", () => {
			if (this.options.redirectUrl)
				return Response.redirect(this.options.redirectUrl, 302)
			throw new StatusError(404)
		})
		this.router.post(
			this.options.interactionRoute || "/interaction",
			async (req, ctx?: ExecutionContext) => {
				return await this.handle(req, ctx)
			}
		)
	}

	/**
	 * If you want use a custom handler for HTTP requests instead of Carbon's router, you can use this method.
	 * @param req The request to handle
	 * @param ctx Cloudflare Workers only. The execution context of the request, provided in the fetch handler from CF.
	 * @returns A response to send back to the client.
	 */
	public async handle(req: Request, ctx?: ExecutionContext) {
		const isValid = await this.validateInteraction(req)
		if (!isValid) {
			return new Response("Invalid request signature", { status: 401 })
		}

		const rawInteraction = (await req.json()) as unknown as APIInteraction
		if (rawInteraction.type === InteractionType.Ping) {
			return json({
				type: InteractionResponseType.Pong
			})
		}

		if (rawInteraction.type === InteractionType.ApplicationCommand) {
			if (ctx?.waitUntil) {
				ctx.waitUntil(
					(async () => {
						await this.commandHandler.handleCommandInteraction(rawInteraction)
					})()
				)
			} else {
				await this.commandHandler.handleCommandInteraction(rawInteraction)
			}
		}
		if (
			rawInteraction.type === InteractionType.ApplicationCommandAutocomplete
		) {
			if (ctx?.waitUntil) {
				ctx.waitUntil(
					(async () => {
						await this.commandHandler.handleAutocompleteInteraction(
							rawInteraction
						)
					})()
				)
			} else {
				await this.commandHandler.handleAutocompleteInteraction(rawInteraction)
			}
		}
		if (rawInteraction.type === InteractionType.MessageComponent) {
			if (ctx?.waitUntil) {
				ctx.waitUntil(
					(async () => {
						await this.componentHandler.handleInteraction(rawInteraction)
					})()
				)
			} else {
				await this.componentHandler.handleInteraction(rawInteraction)
			}
		}
		if (rawInteraction.type === InteractionType.ModalSubmit) {
			if (ctx?.waitUntil) {
				ctx.waitUntil(
					(async () => {
						await this.modalHandler.handleInteraction(rawInteraction)
					})()
				)
			} else {
				await this.modalHandler.handleInteraction(rawInteraction)
			}
		}
		return new Response(null, { status: 202 })
	}

	/**
	 * Validate the interaction request
	 * @param req The request to validate
	 */
	private async validateInteraction(req: Request) {
		const body = await req.clone().text()
		const signature = req.headers.get("X-Signature-Ed25519")
		const timestamp = req.headers.get("X-Signature-Timestamp")
		if (!timestamp || !signature || req.method !== "POST" || !body) {
			throw new StatusError(401)
		}
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
		return new GuildMember(this, member, new Guild(this, guildId))
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
