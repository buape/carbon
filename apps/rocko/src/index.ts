import { Client, type Interaction, type Command } from "carbon"
import { serve } from "@carbonjs/nodejs"

class PingCommand implements Command {
	name = "ping"
	description = "A simple ping command"
	defer = true

	async run(interaction: Interaction) {
		interaction.reply("Pong")
	}
}

const client = new Client({
	clientId: process.env.CLIENT_ID!,
	publicKey: process.env.PUBLIC_KEY!
}, [
	new PingCommand()
])

serve(client, { port: 3000 })