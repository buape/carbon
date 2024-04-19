import { serve } from "@carbonjs/nodejs"
import { Client, Command, type CommandInteraction } from "carbon"
import { Subc } from "./subcommand.js"
import { inspect } from "node:util"

class PingCommand extends Command {
	name = "ping"
	description = "A simple ping command"
	defer = true

	async run(interaction: CommandInteraction) {
		await sleep(3000)
		interaction.reply({ content: "Pong" })
	}
}

const client = new Client(
	{
		clientId: process.env.CLIENT_ID!,
		publicKey: process.env.PUBLIC_KEY!,
		token: process.env.DISCORD_TOKEN!
	},
	[new PingCommand(), new Subc()]
)

serve(client, { port: 3000 })

console.log(inspect(client.commands.map((x) => x.serialize()), false, null, true))

export const sleep = async (ms: number) => {
	return new Promise((resolve) => setTimeout(resolve, ms))
}
