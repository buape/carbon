import type { ExecutionContext } from "@cloudflare/workers-types/2023-07-01"
import { Client, ClientMode } from "@buape/carbon"

import ButtonCommand from "./commands/testing/button.js"
import Options from "./commands/testing/options.js"
import PingCommand from "./commands/ping.js"

type Env = {
	CLIENT_ID: string
	PUBLIC_KEY: string
	DISCORD_TOKEN: string
}

export default {
	async fetch(request: Request, env: Env, _ctx: ExecutionContext) {
		const client = new Client(
			{
				clientId: env.CLIENT_ID,
				publicKey: env.PUBLIC_KEY,
				token: env.DISCORD_TOKEN,
				mode: ClientMode.CloudflareWorkers
			},
			[new ButtonCommand(), new Options(), new PingCommand()]
		)
		if (request.url.endsWith("/deploy")) {
			await client.deployCommands()
			return new Response("Deployed commands")
		}
		return client.router.fetch(request)
	}
}
