import {
	ListenerEvent,
	type ListenerEventData,
	ReadyListener
} from "@buape/carbon"

export class Ready extends ReadyListener {
	readonly type = ListenerEvent.Ready
	async handle(data: ListenerEventData[typeof ListenerEvent.Ready]) {
		console.log(`Logged in as ${data.user.username}`)
	}
}
