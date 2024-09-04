import { dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { Client, ClientMode } from "@buape/carbon"
import {
	ApplicationRoleConnectionMetadataType,
	LinkedRoles
} from "@buape/carbon-linked-roles"
import { loadCommands, serve } from "@buape/carbon-nodejs"
const __dirname = dirname(fileURLToPath(import.meta.url))

if (
	!process.env.CLIENT_ID ||
	!process.env.PUBLIC_KEY ||
	!process.env.DISCORD_TOKEN ||
	!process.env.CLIENT_SECRET
) {
	throw new Error("Missing environment variables")
}

const client = new Client(
	{
		clientId: process.env.CLIENT_ID,
		publicKey: process.env.PUBLIC_KEY,
		token: process.env.DISCORD_TOKEN,
		mode: ClientMode.NodeJS,
		requestOptions: {
			queueRequests: false
		},
		autoDeploy: true
	},
	await loadCommands("commands", __dirname)
)

serve(client, { port: 3000 })

export const sleep = async (ms: number) => {
	return new Promise((resolve) => setTimeout(resolve, ms))
}

new LinkedRoles(client, {
	clientSecret: process.env.CLIENT_SECRET,
	baseUrl: "http://localhost:3000",
	metadata: [
		{
			key: "is_shadow",
			name: "Whether you are Shadow",
			description: "You gotta be Shadow to get this one!",
			type: ApplicationRoleConnectionMetadataType.BooleanEqual
		}
	],
	metadataCheckers: {
		is_shadow: async (userId) => {
			return userId === "439223656200273932"
		}
	}
})
