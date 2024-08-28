import { Client as RestClient } from "@carbonjs/discord-request"
import {
	type APIInteraction,
	InteractionResponseType,
	InteractionType,
	RouteBases,
	Routes
} from "discord-api-types/v10"
import { PlatformAlgorithm, isValidRequest } from "discord-verify"
import { AutoRouter, type IRequestStrict, StatusError, json } from "itty-router"
import type { BaseCommand } from "../structures/BaseCommand.js"
import { ComponentHandler } from "../structures/ComponentHandler.js"
import { CommandHandler } from "../structures/CommandHandler.js"

/**
 * The mode that the client is running in.
 * Different platforms have different requirements for how processes are handled.
 */
export enum ClientMode {
	NodeJS = "node",
	CloudflareWorkers = "cloudflare",
	Vercel = "vercel",
	Web = "web"
}

/**
 * The options used for initializing the client
 */
export type ClientOptions = {
	redirectUrl?: string
	clientId: string
	publicKey: string
	token: string
	mode: ClientMode
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
	rest: RestClient
	/**
	 * The handler for the component interactions sent from Discord
	 */
	componentHandler: ComponentHandler
	commandHandler: CommandHandler

	/**
	 * Creates a new client
	 * @param options The options used to initialize the client
	 * @param commands The commands that the client has registered
	 */
	constructor(options: ClientOptions, commands: BaseCommand[]) {
		this.options = options
		this.commands = commands
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		this.router = AutoRouter<IRequestStrict, any[], Response>()
		this.rest = new RestClient({
			userAgent: `DiscordBot (https://github.com/buape/carbon v0.0.0)`
		}).setToken(options.token)
		this.componentHandler = new ComponentHandler(this)
		this.commandHandler = new CommandHandler(this)
		this.setupRoutes()
		if (this.options.mode === ClientMode.NodeJS) this.deployCommands()
	}

	/**
	 * Deploy the commands registered to Discord.
	 * This is automatically called when running in NodeJS mode.
	 */
	async deployCommands() {
		try {
			const commands = this.commands.map((command) => {
				return command.serialize()
			})
			await fetch(
				RouteBases.api + Routes.applicationCommands(this.options.clientId),
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bot ${this.options.token}`
					},
					method: "PUT",
					body: JSON.stringify(commands)
				}
			)
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
		this.router.post("/interaction", async (req, ctx?: ExecutionContext) => {
			console.log(ctx)
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

			try {
				if (rawInteraction.type === InteractionType.ApplicationCommand) {
					if (ctx?.waitUntil)
						ctx.waitUntil(this.commandHandler.handleInteraction(rawInteraction))
					else await this.commandHandler.handleInteraction(rawInteraction)
				}
				if (rawInteraction.type === InteractionType.MessageComponent) {
					if (ctx?.waitUntil)
						ctx.waitUntil(
							this.componentHandler.handleInteraction(rawInteraction)
						)
					else await this.componentHandler.handleInteraction(rawInteraction)
				}
				return new Response(null, { status: 202 })
			} catch (err: unknown) {
				if (err instanceof Error)
					// TODO: Custom error instances
					return new Response(
						JSON.stringify({
							type: InteractionResponseType.ChannelMessageWithSource,
							data: { content: err.message }
						})
					)
			}
		})
	}

	/**
	 * Validate the interaction request
	 * @param req The request to validate
	 */
	private async validateInteraction(req: IRequestStrict) {
		if (req.method !== "POST") {
			throw new StatusError(405)
		}
		const isValid = await isValidRequest(
			req,
			this.options.publicKey,
			this.options.mode === ClientMode.CloudflareWorkers
				? PlatformAlgorithm.Cloudflare
				: this.options.mode === ClientMode.Vercel
					? PlatformAlgorithm.VercelProd
					: this.options.mode === ClientMode.Web
						? PlatformAlgorithm.Web
						: PlatformAlgorithm.NewNode
		)
		return isValid
	}
}

export interface ExecutionContext {
	// biome-ignore lint/suspicious/noExplicitAny: true any
	waitUntil(promise: Promise<any>): void
}
