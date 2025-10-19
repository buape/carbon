import "dotenv/config"
import { Client } from "@buape/carbon"
import { createServer } from "@buape/carbon/adapters/node"
import { GatewayIntents, ShardingPlugin } from "@buape/carbon/sharding"
import { VoicePlugin } from "@buape/carbon/voice"
import GatewayTestCommand from "./commands/gateway-test.js"
import PingCommand from "./commands/ping.js"
import VoiceConnectCommand from "./commands/voice-connect.js"
// import { MessageCreate } from "./events/messageCreate.js"
import { Ready } from "./events/ready.js"

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
			new PingCommand(),
			new GatewayTestCommand(),
			new VoiceConnectCommand()
		],
		listeners: [
			new Ready()
			// new MessageCreate()
		]
	},
	[
		new ShardingPlugin({
			intents:
				GatewayIntents.Guilds |
				GatewayIntents.GuildMessages |
				GatewayIntents.MessageContent |
				GatewayIntents.GuildMembers // Required for RequestGuildMembers
		}),
		new VoicePlugin()
	]
)

console.log(
	`Carbon initialized with routes:${client.routes
		.filter((x) => !x.disabled)
		.map((x) => {
			return `\n\t${x.method} ${x.path}`
		})}\nand listeners:${client.listeners.map((x) => {
		return `\n\t${x.type}`
	})}`
)

createServer(client, { port: 3000 })

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			BASE_URL: string
			DEPLOY_SECRET: string
			DISCORD_CLIENT_ID: string
			DISCORD_PUBLIC_KEY: string
			DISCORD_BOT_TOKEN: string
		}
	}
}
