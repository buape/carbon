import { Base } from "../abstracts/Base.js"
import type { ListenerEventRawData } from "../types/index.js"

export class EventHandler extends Base {
	async handleEvent<T extends keyof ListenerEventRawData>(
		payload: ListenerEventRawData[T],
		type: T
	) {
		const listeners = this.client.listeners.filter((x) => x.type === type)
		await Promise.all(
			listeners.map((listener) => {
				const data = listener.parseRawData(payload, this.client)
				return listener.handle(data, this.client).catch((err: unknown) => {
					console.error(err)
				})
			})
		)
	}
}
