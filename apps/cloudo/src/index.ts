import { Client, createHandle } from "@buape/carbon"
import { createHandler } from "@buape/carbon/adapters/cloudflare"
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
import PermissionCommand from "./commands/testing/permission.js"
import SubcommandsCommand from "./commands/testing/subcommand.js"
import SubcommandGroupsCommand from "./commands/testing/subcommandgroup.js"
import UserCommand from "./commands/testing/user_command.js"

const handle = createHandle((env) => {
	const client = new Client(
		{
			baseUrl: String(env.BASE_URL),
			deploySecret: String(env.DEPLOY_SECRET),
			clientId: String(env.DISCORD_CLIENT_ID),
			clientSecret: String(env.DISCORD_CLIENT_SECRET),
			publicKey: String(env.DISCORD_PUBLIC_KEY),
			token: String(env.DISCORD_BOT_TOKEN)
		},
		[
			// commands/*
			new PingCommand(),
			// commands/testing/*
			new ButtonCommand(),
			new EphemeralCommand(),
			new EverySelectCommand(),
			new MessageCommand(),
			new ModalCommand(),
			new OptionsCommand(),
			new PermissionCommand(),
			new SubcommandsCommand(),
			new SubcommandGroupsCommand(),
			new UserCommand()
		]
	)
	const linkedRoles = new LinkedRoles(client, {
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
	return [client, linkedRoles]
})

const handler = createHandler(handle)
export default { fetch: handler }
