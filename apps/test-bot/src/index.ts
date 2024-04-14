import { Client, type Interaction, type Command } from "carbon"

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

client.start(3000)