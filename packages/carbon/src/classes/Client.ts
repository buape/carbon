import type { ClientOptions } from "../typings.js";
import { AutoRouter, StatusError, json, type IRequestStrict } from "itty-router"
import { PlatformAlgorithm, isValidRequest } from "discord-verify";
import { type APIInteraction, InteractionResponseType, InteractionType, MessageFlags, Routes, RouteBases } from "discord-api-types/v10";
import type { Command } from "../structures/Command.js";
import { Interaction } from "./Interaction.js";

export class Client {
	options: ClientOptions
	commands: Command[]
	router: ReturnType<typeof AutoRouter>
	constructor(options: ClientOptions, commands: Command[]) {
		this.options = options
		this.commands = commands
		this.router = AutoRouter()
		this.setupRoutes()
		this.deployCommands()
	}

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
		} catch { }
	}

	private setupRoutes() {
		this.router.get("/", () => {
			if (this.options.redirectUrl) return Response.redirect(this.options.redirectUrl, 302)
			throw new StatusError(404)
		})
		this.router.post("/interaction", async (req: IRequestStrict) => {
			const isValid = await this.validateInteraction(req)
			if (!isValid) {
				return new Response("Invalid request signature", { status: 401 })
			}

			const rawInteraction = await req.json() as unknown as APIInteraction
			console.log(rawInteraction)
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

			const command = this.commands.find(x => x.name === rawInteraction.data.name)
			if (!command) return new Response(null, { status: 400 })

			const interaction = new Interaction(rawInteraction)

			if (command.defer) {
				command.run(interaction)
				return json({
					type: InteractionResponseType.DeferredChannelMessageWithSource,
					flags: command.ephemeral ? MessageFlags.Ephemeral : 0
				})
			}
			return json({
				type: InteractionResponseType.ChannelMessageWithSource,
				content: "Man someone should really implement non-deferred replies huh"
			})


		})

	}

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