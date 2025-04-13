import type { ListenerEvent, ListenerEventData, ValueOf } from "../types.js"
import type { Client } from "./Client.js"

export abstract class Listener {
	abstract readonly type: ValueOf<typeof ListenerEvent>
	abstract handle(
		data: ListenerEventData[this["type"]],
		client: Client
	): Promise<void>
}
