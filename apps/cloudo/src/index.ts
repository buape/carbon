// TODO: Test

import { Client, createHandle } from "@buape/carbon"
import { createHandler } from "@buape/carbon/adapters/cloudflare"
import PingCommand from "./commands/ping.js"

const handle = createHandle((env) => {
	const client = new Client(
		{
			clientId: String(env.CLIENT_ID),
			publicKey: String(env.PUBLIC_KEY),
			token: String(env.DISCORD_TOKEN)
		},
		[new PingCommand()]
	)

	return [client]
})

const handler = createHandler(handle, {})
export default { fetch: handler }
