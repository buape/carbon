import type { Client } from "../../classes/Client.js"
import { InteractionCreateListener } from "../../classes/Listener.js"
import { ListenerEvent, type ListenerEventData } from "../../types/listeners.js"

export class InteractionEventListener extends InteractionCreateListener {
	readonly type = ListenerEvent.InteractionCreate

	async handle(data: ListenerEventData[this["type"]], client: Client) {
		await client.handleInteraction(data, {})
	}
}
