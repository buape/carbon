import "dotenv/config"
import { Client, GatewayIntentBits } from "@buape/carbon"
import { createServer } from "@buape/carbon/adapters/node"
import { GatewayPlugin } from "@buape/carbon/gateway"
import PingCommand from "./commands/ping.js"
import { MessageCreateListener } from "./events/messageCreate.js"
import { ReadyListener } from "./events/ready.js"

const client = new Client(
	{
		baseUrl: process.env.BASE_URL,
		deploySecret: process.env.DEPLOY_SECRET,
		clientId: process.env.DISCORD_CLIENT_ID,
		publicKey: process.env.DISCORD_PUBLIC_KEY,
		token: process.env.DISCORD_BOT_TOKEN
	},
	{
		commands: [
			// commands/*
			new PingCommand()
		],
		listeners: [new ReadyListener(), new MessageCreateListener()]
	},
	[
		new GatewayPlugin({
			intents: GatewayIntentBits.Guilds | GatewayIntentBits.GuildMessages
		})
	]
)

console.log(
	`Carbon initialized with routes:${client.routes
		.filter((x) => !x.disabled)
		.map((x) => {
			return `\n\t${x.method} ${x.path}`
		})}`
)

createServer(client, { port: 3000 })

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			BASE_URL: string
			DEPLOY_SECRET: string
			DISCORD_CLIENT_ID: string
			DISCORD_CLIENT_SECRET: string
			DISCORD_PUBLIC_KEY: string
			DISCORD_BOT_TOKEN: string
		}
	}
}
