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
				clientId: "1277072471979331584",
				publicKey:
					"7791cdc93fa19fe624f10edebfb444a572eab16c756fafbebe084b3ea87c6bc3",
				token:
					"MTI3NzA3MjQ3MTk3OTMzMTU4NA.GGTVyY.2if5MiHhqdL_Qukxyy7GjQww2ejnKsDKIgoTNo",
				mode: ClientMode.CloudflareWorkers
			},
			[new ButtonCommand(), new Options(), new PingCommand()]
		)
		if (request.url.endsWith("/deploy")) {
			await client.deployCommands()
			return new Response("Deployed commands")
		}
		return client.router.fetch(request, ctx)
	}
}