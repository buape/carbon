import { Base } from "../abstracts/Base.js"
import type { ListenerEventData } from "../types.js"

export class EventHandler extends Base {
	async handleEvent<T extends keyof ListenerEventData>(
		payload: ListenerEventData[T],
		type: T
	) {
		console.log(
			"all listeners",
			this.client.listeners.map((x) => x.type)
		)
		console.log("handleEvent", type)
		const listeners = this.client.listeners.filter((x) => x.type === type)
		console.log("listeners", listeners)
		await Promise.all(
			listeners.map((listener) => listener.handle(payload, this.client))
		)
	}
}
