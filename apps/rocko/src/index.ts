import { serve } from "@carbonjs/nodejs"
import { Client, Command, type Interaction } from "carbon"

class PingCommand extends Command {
	name = "ping"
	description = "A simple ping command"
	defer = true

	async run(interaction: Interaction) {
		await sleep(7500)
		interaction.reply({ content: "Pong" })
	}
}

const client = new Client(
	{
		clientId: process.env.CLIENT_ID!,
		publicKey: process.env.PUBLIC_KEY!,
		token: process.env.DISCORD_TOKEN!
	},
	[new PingCommand()]
)

serve(client, { port: 3000 })

const sleep = async (ms: number) => {
	return new Promise((resolve) => setTimeout(resolve, ms))
}
