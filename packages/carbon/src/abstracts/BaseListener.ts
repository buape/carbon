import type { Client } from "../classes/Client.js"
import type {
	ListenerEvent,
	ListenerEventData,
	ListenerEventRawData,
	ValueOf
} from "../types/listeners.js"

/**
 * Base class for creating event listeners that handle Discord gateway events.
 * This abstract class defines the structure for event listeners and provides type safety for event handling.
 * @abstract
 */
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
