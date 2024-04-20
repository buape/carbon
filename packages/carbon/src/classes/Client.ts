import { Client as RestClient } from "@carbonjs/discord-request"
import {
	type APIInteraction,
	ApplicationCommandType,
	InteractionResponseType,
	InteractionType,
	MessageFlags,
	RouteBases,
	Routes
} from "discord-api-types/v10"
import { PlatformAlgorithm, isValidRequest } from "discord-verify"
import { AutoRouter, type IRequestStrict, StatusError, json } from "itty-router"
import pkg from "../../package.json" assert { type: "json" }
import type { BaseCommand } from "../structures/BaseCommand.js"
import { CommandInteraction } from "../structures/CommandInteraction.js"
import { Command } from "./Command.js"
import { CommandWithSubcommands } from "./CommandWithSubcommands.js"

/**
 * The options used for initializing the client
 */
export type ClientOptions = {
	redirectUrl?: string
	clientId: string
	publicKey: string
	token: string
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
			userAgent: `DiscordBot (https://github.com/buape/carbon v${pkg.version})`
		}).setToken(options.token)
		this.setupRoutes()
		this.deployCommands()
	}

	/**
	 * Deploy the commands registered to Discord
	 */
	private async deployCommands() {
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
		} catch {}
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
		this.router.post("/interaction", async (req) => {
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

			if (rawInteraction.type !== InteractionType.ApplicationCommand) {
				return json({
					type: InteractionResponseType.ChannelMessageWithSource,
					data: {
						content: "Interaction type not supported"
					}
				})
			}

			const command = this.commands.find(
				(x) => x.name === rawInteraction.data.name
			)
			if (!command) return new Response(null, { status: 400 })

			const interaction = new CommandInteraction(this, rawInteraction, command)

			if (command instanceof Command) {
				if (command.defer) {
					command.run(interaction)
					return json({
						type: InteractionResponseType.DeferredChannelMessageWithSource,
						flags: command.ephemeral ? MessageFlags.Ephemeral : 0
					})
				}
				return json({
					type: InteractionResponseType.ChannelMessageWithSource,
					content:
						"Man someone should really implement non-deferred replies huh"
				})
			}

			if (command instanceof CommandWithSubcommands) {
				if (rawInteraction.data.type !== ApplicationCommandType.ChatInput) {
					return json({
						type: InteractionResponseType.ChannelMessageWithSource,
						data: {
							content: "Subcommands must be used with ChatInput"
						}
					})
				}
				const data = rawInteraction.data
				const subcommand = command.subcommands.find(
					(x) => x.name === data.options?.[0]?.name
				)
				if (!subcommand) return new Response(null, { status: 400 })

				if (subcommand.defer) {
					subcommand.run(interaction)
					return json({
						type: InteractionResponseType.DeferredChannelMessageWithSource,
						flags: subcommand.ephemeral ? MessageFlags.Ephemeral : 0
					})
				}
				return json({
					type: InteractionResponseType.ChannelMessageWithSource
				})
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
			PlatformAlgorithm.NewNode
		)
		return isValid
	}
}
