import { type APIApplicationCommand, Routes } from "discord-api-types/v10"
import { Plugin } from "../../abstracts/Plugin.js"
import type { Client } from "../../classes/Client.js"

/**
 * This plugin is a basic plugin that allows you to get the command data from the client over HTTP.
 * The JSON array provided here is the same as the one you would send to Discord, allowing you to build your own command deployment setup.
 */
export class CommandDataPlugin extends Plugin {
	readonly id = "command-data"
	client?: Client

	public registerClient(client: Client): void {
		this.client = client
	}

	public registerRoutes(client: Client) {
		client.routes.push(
			{
				method: "GET",
				path: "/commands",
				handler: this.handleCommandDataRequest.bind(this)
			},
			{
				method: "GET",
				path: "/commands/full",
				handler: this.handleFullCommandDataRequest.bind(this)
			}
		)
	}

	private discordCommandData: APIApplicationCommand[] | null = null
	public async handleFullCommandDataRequest() {
		if (!this.client)
			return new Response("Client not registered", { status: 500 })
		if (this.discordCommandData) return Response.json(this.discordCommandData)
		const commands = (await this.client.rest.get(
			Routes.applicationCommands(this.client.options.clientId)
		)) as APIApplicationCommand[]
		this.discordCommandData = commands
		return Response.json(commands)
	}

	public async handleCommandDataRequest() {
		if (!this.client)
			return new Response("Client not registered", { status: 500 })
		const commands = this.client?.commands
			.filter((c) => c.name !== "*")
			.map((c) => c.serialize())
		return Response.json(commands)
	}
}
