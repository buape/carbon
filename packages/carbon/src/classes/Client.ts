import type { ClientOptions } from "../typings.js";
import { type Context, Hono } from "hono"
import { verify } from "discord-verify";
import { type APIInteraction, InteractionResponseType, InteractionType } from "discord-api-types/v10";
import type { Command } from "../structures/Command.js";

export class Client {
	options: ClientOptions
	commands: Command[]
	router: Hono
	constructor(options: ClientOptions, commands: Command[]) {
		this.options = options
		this.commands = commands
		this.router = new Hono()
		this.setupRoutes()
	}

	private setupRoutes() {
		this.router.get("/", (c) => {
			if (this.options.redirectUrl) return c.redirect(this.options.redirectUrl)
			c.status(401)
			return c.json({ error: "Unauthorized" })
		})
		this.router.get("/interaction", async (c) => {
			const validated = this.validateInteraction(c)
			if (validated) return validated

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
			if (!command) return c.notFound()

			if (command.defer) return


		})

	}

	private validateInteraction(c: Context) {
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
		const body = JSON.stringify(c.body)
		const isValid = verify(
			body,
			signature,
			timestamp,
			this.options.publicKey,
			crypto.subtle
		)
		if (!isValid) {
			c.status(401)
			return c.json({ error: "Invalid request signature." })
		}
		return
	}
}