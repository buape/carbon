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
import EphemeralCommand from "./commands/testing/ephemeral.js"
import EverySelectCommand from "./commands/testing/every_select.js"
import MessageCommand from "./commands/testing/message_command.js"
import ModalCommand from "./commands/testing/modal.js"
import OptionsCommand from "./commands/testing/options.js"
import SubcommandsCommand from "./commands/testing/subcommand.js"
import SubcommandGroupsCommand from "./commands/testing/subcommandgroup.js"
import UserCommand from "./commands/testing/user_command.js"

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
		publicKey: process.env.DISCORD_PUBLIC_KEY,
		token: process.env.DISCORD_BOT_TOKEN
	},
	[
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
		new SubcommandsCommand(),
		new SubcommandGroupsCommand(),
		new UserCommand(),
		new MentionsCommand()
	],
	[linkedRoles]
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
