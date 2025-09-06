import { Base } from "../abstracts/Base.js"
import type {
	ListenerEventAdditionalData,
	ListenerEventRawData
} from "../types/index.js"

/**
 * Handles Discord gateway events and dispatches them to registered listeners.
 * This class is responsible for managing and executing event listeners for various Discord events.
 * @internal
 */
export class EventHandler extends Base {
	async handleEvent<T extends keyof ListenerEventRawData>(
		payload: ListenerEventRawData[T] & ListenerEventAdditionalData,
		type: T
	) {
		const listeners = this.client.listeners.filter((x) => x.type === type)
		await Promise.all(
			listeners.map((listener) => {
				const data = listener.parseRawData(payload, this.client)
				return listener
					.handle({ ...data, clientId: payload.clientId }, this.client)
					.catch((err: unknown) => {
						console.error(err)
					})
			})
		)
	}
}
