import "dotenv/config"
import { Client, type CommandMiddleware } from "@buape/carbon"
import { createServer } from "@buape/carbon/adapters/node"
import { GatewayIntents, ShardingPlugin } from "@buape/carbon/sharding"
import { VoicePlugin } from "@buape/carbon/voice"
import GatewayTestCommand from "./commands/gateway-test.js"
import MiddlewareCommand from "./commands/middleware.js"
import PingCommand from "./commands/ping.js"
import VoiceConnectCommand from "./commands/voice-connect.js"
// import { MessageCreate } from "./events/messageCreate.js"
import { Ready } from "./events/ready.js"

const globalCommandMiddleware = {
	before(context) {
		console.log(
			`[socketo/global-before] /${context.command.name} user=${context.interaction.userId ?? "unknown"}`
		)
	},
	after(context) {
		console.log(
			`[socketo/global-after] /${context.command.name} status=${context.status} duration=${context.durationMs}ms`
		)
	}
} satisfies CommandMiddleware

const client = new Client(
	{
		baseUrl: process.env.BASE_URL,
		deploySecret: process.env.DEPLOY_SECRET,
		clientId: process.env.DISCORD_CLIENT_ID,
		publicKey: process.env.DISCORD_PUBLIC_KEY,
		token: process.env.DISCORD_BOT_TOKEN,
		commandMiddlewares: [globalCommandMiddleware]
	},
	{
		commands: [
			// commands/*
			new PingCommand(),
			new GatewayTestCommand(),
			new VoiceConnectCommand(),
			new MiddlewareCommand()
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
				GatewayIntents.GuildMembers | // Required for RequestGuildMembers
				GatewayIntents.GuildVoiceStates // Required for voice state tracking
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
