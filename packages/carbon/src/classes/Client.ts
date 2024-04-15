import type { ClientOptions } from "../typings.js";
import { type Context, Hono } from "hono"
import { verify } from "discord-verify";
import { type APIInteraction, InteractionResponseType, InteractionType, MessageFlags, Routes, RouteBases } from "discord-api-types/v10";
import type { Command } from "../structures/Command.js";
import { Interaction } from "./Interaction.js";

export class Client {
	options: ClientOptions
	commands: Command[]
	router: Hono
	constructor(options: ClientOptions, commands: Command[]) {
		this.options = options
		this.commands = commands
		this.router = new Hono()
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
		this.router.get("/", (c) => {
			if (this.options.redirectUrl) return c.redirect(this.options.redirectUrl)
			c.status(401)
			return c.json({ error: "Unauthorized" })
		})
		this.router.post("/interaction", async (c) => {
			const isValid = await this.validateInteraction(c)
			if (!isValid) {
				c.status(401)
				return c.json({ error: "Invalid request signature." })
			}

			const rawInteraction = c.req.json() as unknown as APIInteraction
			if (rawInteraction.type === InteractionType.Ping) {
				return c.json({
					type: InteractionResponseType.Pong
				})
			}

			if (rawInteraction.type !== InteractionType.ApplicationCommand) {
				return c.json({
					type: InteractionResponseType.ChannelMessageWithSource,
					data: {
						content: "Interaction type not supported"
					}
				})
			}

			const command = this.commands.find(x => x.name === rawInteraction.data.name)
			if (!command) return c.status(400)

			const interaction = new Interaction(rawInteraction)

			if (command.defer) {
				command.run(interaction)
				return c.json({
					type: InteractionResponseType.DeferredChannelMessageWithSource,
					flags: command.ephemeral ? MessageFlags.Ephemeral : 0
				})
			}
			return c.json({
				type: InteractionResponseType.ChannelMessageWithSource,
				content: "Man someone should really implement non-deferred replies huh"
			})


		})

	}

	private async validateInteraction(c: Context) {
		if (c.req.method !== "POST") {
			c.status(405)
			return c.json({ error: "Method not allowed." })
		}
		if (
			!c.req.header("x-signature-ed25519") ||
			!c.req.header("x-signature-timestamp")
		) {
			c.status(401)
			return c.json({ error: "Invalid request signature." })
		}
		const signature = c.req.header("x-signature-ed25519")
		const timestamp = c.req.header("x-signature-timestamp")
		const body = JSON.stringify(c.req.json())
		const isValid = await verify(
			body,
			signature,
			timestamp,
			this.options.publicKey,
			crypto.subtle
		)
		return isValid
	}
}