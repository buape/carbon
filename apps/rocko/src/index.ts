import { inspect } from "node:util"
import { Client } from "@buape/carbon"
import { loadCommands, serve } from "@carbonjs/nodejs"
import { fileURLToPath } from "node:url"
import { dirname } from "node:path"
const __dirname = dirname(fileURLToPath(import.meta.url))

const client = new Client(
	{
		clientId: process.env.CLIENT_ID!,
		publicKey: process.env.PUBLIC_KEY!,
		token: process.env.DISCORD_TOKEN!
	},
	await loadCommands("commands", __dirname)
)

serve(client, { port: 3000 })

console.log(
	inspect(
		client.commands.map((x) => x.serialize()),
		false,
		null,
		true
	)
)

export const sleep = async (ms: number) => {
	return new Promise((resolve) => setTimeout(resolve, ms))
}
