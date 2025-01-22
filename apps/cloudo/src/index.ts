import { Client } from "@buape/carbon"
import { createHandler } from "@buape/carbon/adapters/fetch"
import {
	ApplicationRoleConnectionMetadataType,
	LinkedRoles
} from "@buape/carbon/linked-roles"
import PingCommand from "./commands/ping.js"
import ButtonCommand from "./commands/testing/button.js"
import EphemeralCommand from "./commands/testing/ephemeral.js"
import EverySelectCommand from "./commands/testing/every_select.js"
import MessageCommand from "./commands/testing/message_command.js"
import ModalCommand from "./commands/testing/modal.js"
import OptionsCommand from "./commands/testing/options.js"
import SubcommandsCommand from "./commands/testing/subcommand.js"
import SubcommandGroupsCommand from "./commands/testing/subcommandgroup.js"
import UserCommand from "./commands/testing/user_command.js"
import ApplicationAuthorizedListener from "./events/authorized.js"

const linkedRoles = new LinkedRoles({
	metadata: [
		{
			key: "is_staff",
			name: "Verified Staff",
			description: "Whether the user is a verified staff member",
			type: ApplicationRoleConnectionMetadataType.BooleanEqual
		}
	],
	metadataCheckers: {
		is_staff: async (userId) => {
			const isAllowed = ["439223656200273932"]
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
		publicKey: process.env.DISCORD_PUBLIC_KEY,
		token: process.env.DISCORD_BOT_TOKEN
	},
	{
		commands: [
			// commands/*
			new PingCommand(),
			// commands/testing/*
			new ButtonCommand(),
			new EphemeralCommand(),
			new EverySelectCommand(),
			new MessageCommand(),
			new ModalCommand(),
			new OptionsCommand(),
			new SubcommandsCommand(),
			new SubcommandGroupsCommand(),
			new UserCommand()
		],
		listeners: [new ApplicationAuthorizedListener()]
	},
	[linkedRoles]
)

const handler = createHandler(client)
export default { fetch: handler }

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
