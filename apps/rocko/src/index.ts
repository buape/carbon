import "dotenv/config"
import { Client } from "@buape/carbon"
import { createServer } from "@buape/carbon/adapters/node"
import {
	ApplicationRoleConnectionMetadataType,
	LinkedRoles
} from "@buape/carbon/linked-roles"
import PingCommand from "./commands/ping.js"
import MentionsCommand from "./commands/testing/allow_mentions.js"
import AttachmentCommand from "./commands/testing/attachment.js"
import ButtonCommand from "./commands/testing/button.js"
import ComponentsV2 from "./commands/testing/components_v2.js"
import EphemeralCommand from "./commands/testing/ephemeral.js"
import EverySelectCommand from "./commands/testing/every_select.js"
import MessageCommand from "./commands/testing/message_command.js"
import ModalCommand from "./commands/testing/modal.js"
import OptionsCommand from "./commands/testing/options.js"
import PermissionCommand from "./commands/testing/permissions.js"
import SubcommandsCommand from "./commands/testing/subcommand.js"
import SubcommandGroupsCommand from "./commands/testing/subcommandgroup.js"
import UserCommand from "./commands/testing/user_command.js"
import { ApplicationAuthorized } from "./events/authorized.js"
import { MessageCreate } from "./events/messageCreate.js"
import PrecheckCommand from "./commands/testing/precheck.js"
const linkedRoles = new LinkedRoles({
	metadata: [
		{
			key: "random",
			name: "Verified Staff",
			description: "Whether the user is a verified staff member",
			type: ApplicationRoleConnectionMetadataType.BooleanEqual
		}
	],
	metadataCheckers: {
		random: async (userId) => {
			const isAllowed = ["548150274414608399"]
			if (isAllowed.includes(userId)) return true
			return false
		}
	}
})

const client = new Client(
	{
		baseUrl: process.env.BASE_URL,
		deploySecret: process.env.DEPLOY_SECRET,
		clientId: process.env.DISCORD_CLIENT_ID,
		clientSecret: process.env.DISCORD_CLIENT_SECRET,
		publicKey: [
			process.env.DISCORD_PUBLIC_KEY,
			process.env.FORWARDER_PUBLIC_KEY
		], // Receiving from pointo
		token: process.env.DISCORD_BOT_TOKEN
	},
	{
		commands: [
			// commands/*
			new PingCommand(),
			// commands/testing/*
			new AttachmentCommand(),
			new ButtonCommand(),
			new EphemeralCommand(),
			new EverySelectCommand(),
			new MessageCommand(),
			new ModalCommand(),
			new OptionsCommand(),
			new PermissionCommand(),
			new SubcommandsCommand(),
			new SubcommandGroupsCommand(),
			new ComponentsV2(),
			new UserCommand(),
			new MentionsCommand(),
			new PrecheckCommand()
		],
		listeners: [new ApplicationAuthorized(), new MessageCreate()]
	},
	[linkedRoles]
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
			FORWARDER_PUBLIC_KEY: string // Receiving from pointo
		}
	}
}
