import { Client, createHandle } from "@buape/carbon"
import { createServer } from "@buape/carbon/adapters/node"
import PingCommand from "./commands/ping.js"

const handle = createHandle((env) => {
	const client = new Client(
		{
			clientId: String(env.CLIENT_ID),
			publicKey: String(env.PUBLIC_KEY),
			token: String(env.DISCORD_TOKEN),
			requestOptions: { queueRequests: false },
			autoDeploy: false
		},
		// TODO: Add other commands
		[new PingCommand()]
	)

	return [client]

	// TODO: Test
	// const linkedRoles = new LinkedRoles(client, {
	// 	clientSecret: String(env.CLIENT_SECRET),
	// 	baseUrl: "https://rocko.buape.dev",
	// 	metadata: [
	// 		{
	// 			key: "is_shadow",
	// 			name: "Whether you are Shadow",
	// 			description: "You gotta be Shadow to get this one!",
	// 			type: ApplicationRoleConnectionMetadataType.BooleanEqual
	// 		}
	// 	],
	// 	metadataCheckers: {
	// 		is_shadow: async (userId) => {
	// 			return userId === "439223656200273932"
	// 		}
	// 	}
	// })

	// return [client, linkedRoles]
})

createServer(handle, { port: 3000, relativePath: '/rocko' })
