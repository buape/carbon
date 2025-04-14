import {
	type Client,
	type ListenerEventData,
	MessageCreateListener
} from "@buape/carbon"

export class MessageCreate extends MessageCreateListener {
	async handle(data: ListenerEventData[this["type"]], client: Client) {
		if (
			data.message.channelId === "1229597822907580488" &&
			data.author.id !== client.options.clientId
		) {
			await data.message.reply(`Echo: ${data.content}`)
		}
		console.log(`Message created: ${data.content}`)
	}
}
