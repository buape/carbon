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
	async fetch(request: Request, _env: Env, ctx: ExecutionContext) {
		const client = new Client(
			{
				clientId: _env.CLIENT_ID,
				publicKey: _env.PUBLIC_KEY,
				token: _env.DISCORD_TOKEN,
				mode: ClientMode.CloudflareWorkers
			},
			[new ButtonCommand(), new Options(), new PingCommand()]
		)
		if (request.url.endsWith("/deploy")) {
			await client.deployCommands()
			return new Response("Deployed commands")
		}
		ctx.waitUntil(client.router.fetch(request, ctx))
		return new Response(null, { status: 202 })
	}
}
