import {
	type Client,
	Listener,
	ListenerEvent,
	type ListenerEventData,
	Message
} from "@buape/carbon"

export class MessageCreateListener extends Listener {
	readonly type = ListenerEvent.MessageCreate
	async handle(
		data: ListenerEventData[typeof ListenerEvent.MessageCreate],
		client: Client
	) {
		if (
			data.channel_id === "1229597822907580488" &&
			data.author.id !== client.options.clientId
		) {
			const message = new Message(client, data)
			await message.reply(`Echo: ${data.content}`)
		}
		console.log(`Message created: ${data.content}`)
	}
}
