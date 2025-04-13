import { Listener, ListenerEvent, type ListenerEventData } from "@buape/carbon"

export class MessageCreateListener extends Listener {
	readonly type = ListenerEvent.MessageCreate
	async handle(data: ListenerEventData[typeof ListenerEvent.MessageCreate]) {
		console.log(`Message created: ${data.content}`)
	}
}
