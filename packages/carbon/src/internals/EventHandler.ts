import { Base } from "../abstracts/Base.js"
import type { Listener } from "../classes/Listener.js"
import type { ListenerEventData } from "../types.js"

export class EventHandler extends Base {
	listeners: Listener[] = []

	registerListener(listener: (typeof this.listeners)[number]) {
		this.listeners.push(listener)
	}
	async handleEvent<T extends keyof ListenerEventData>(
		payload: ListenerEventData[T],
		type: T
	) {
		const listeners = this.listeners.filter((x) => x.type === type)
		for (const listener of listeners) {
			await listener.handle(payload, this.client)
		}
	}
}
