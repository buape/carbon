import { Base } from "../abstracts/Base.js"
import type {
	ListenerEventAdditionalData,
	ListenerEventRawData
} from "../types/index.js"
import { EventQueue } from "./EventQueue.js"

/**
 * Handles Discord gateway events and dispatches them to registered listeners.
 * @internal
 */
export class EventHandler extends Base {
	private eventQueue: EventQueue

	constructor(client: typeof Base.prototype.client) {
		super(client)
		this.eventQueue = new EventQueue(client, client.options.eventQueue)
	}

	handleEvent<T extends keyof ListenerEventRawData>(
		payload: ListenerEventRawData[T] & ListenerEventAdditionalData,
		type: T
	): boolean {
		return this.eventQueue.enqueue(payload, type)
	}

	getMetrics() {
		return this.eventQueue.getMetrics()
	}

	hasCapacity(): boolean {
		return this.eventQueue.hasCapacity()
	}
}
