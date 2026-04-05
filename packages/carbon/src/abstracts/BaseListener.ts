import type { Client } from "../classes/Client.js"
import type {
	ListenerEventAdditionalData,
	ListenerEventData,
	ListenerEventRawData,
	ListenerEventType
} from "../types/listeners.js"

/**
 * Base class for creating event listeners that handle Discord gateway events.
 * This abstract class defines the structure for event listeners and provides type safety for event handling.
 * @abstract
 */
export abstract class BaseListener<
	TEvent extends ListenerEventType = ListenerEventType
> {
	abstract readonly type: TEvent
	abstract handle(
		data: ListenerEventData[TEvent] & ListenerEventAdditionalData,
		client: Client
	): Promise<void>

	abstract parseRawData(
		data: ListenerEventRawData[TEvent] & ListenerEventAdditionalData,
		client: Client
	): ListenerEventData[TEvent]
}

export type AnyListener = {
	[TEvent in ListenerEventType]: BaseListener<TEvent>
}[ListenerEventType]
