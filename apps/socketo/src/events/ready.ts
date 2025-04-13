import { Listener, ListenerEvent, type ListenerEventData } from "@buape/carbon"

export class ReadyListener extends Listener {
	readonly type = ListenerEvent.Ready
	async handle(data: ListenerEventData[typeof ListenerEvent.Ready]) {
		console.log(`Logged in as ${data.user.username}`)
	}
}
