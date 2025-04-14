import type { Client } from "../classes/Client.js"
import type {
	ListenerEvent,
	ListenerEventData,
	ListenerEventRawData,
	ValueOf
} from "../types/listeners.js"

export abstract class BaseListener {
	abstract readonly type: ValueOf<typeof ListenerEvent>
	abstract handle(
		data: ListenerEventData[this["type"]],
		client: Client
	): Promise<void>

	abstract parseRawData(
		data: ListenerEventRawData[this["type"]],
		client: Client
	): ListenerEventData[this["type"]]
}
