import { type ListenerEventData, ReadyListener } from "@buape/carbon"

export class Ready extends ReadyListener {
	async handle(data: ListenerEventData[this["type"]]) {
		console.log(`Logged in as ${data.user.username}`)
	}
}
