import { Client, ClientMode } from "@buape/carbon"
import type { ExecutionContext } from "@cloudflare/workers-types/2023-07-01"

import PingCommand from "./commands/ping.js"
import ButtonCommand from "./commands/testing/button.js"
import SelectCommand from "./commands/testing/every_select.js"
import Options from "./commands/testing/options.js"
import Subc from "./commands/testing/subcommand.js"
import SubcG from "./commands/testing/subcommandgroup.js"
import ModalCommand from "./commands/testing/modal.js"

type Env = {
	CLIENT_ID: string
	PUBLIC_KEY: string
	DISCORD_TOKEN: string
}

export default {
	async fetch(request: Request, _env: Env, ctx: ExecutionContext) {
		const client = new Client(
			{
				clientId: _env.CLIENT_ID,
				publicKey: _env.PUBLIC_KEY,
				token: _env.DISCORD_TOKEN,
				mode: ClientMode.CloudflareWorkers
			},
			[
				new ButtonCommand(),
				new Options(),
				new PingCommand(),
				new SelectCommand(),
				new Subc(),
				new SubcG(),
				new ModalCommand()
			]
		)
		if (request.url.endsWith("/deploy")) {
			await client.deployCommands()
			return new Response("Deployed commands")
		}
		const response = await client.router.fetch(request, ctx)
		return response
	}
}
