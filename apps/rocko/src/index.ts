import { dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { Client, ClientMode } from "@buape/carbon"
import { loadCommands, serve } from "@carbonjs/nodejs"
const __dirname = dirname(fileURLToPath(import.meta.url))

const client = new Client(
	{
		clientId: process.env.CLIENT_ID!,
		publicKey: process.env.PUBLIC_KEY!,
		token: process.env.DISCORD_TOKEN!,
		mode: ClientMode.NodeJS
	},
	await loadCommands("commands", __dirname)
)

serve(client, { port: 3000 })

export const sleep = async (ms: number) => {
	return new Promise((resolve) => setTimeout(resolve, ms))
}
