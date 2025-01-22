import {
	type APIWebhookEvent,
	ApplicationWebhookType
} from "discord-api-types/v10"
import { Base } from "../abstracts/Base.js"
import type { Listener } from "../classes/Listener.js"

export class EventHandler extends Base {
	listeners: Listener[] = []

	registerListener(listener: (typeof this.listeners)[number]) {
		this.listeners.push(listener)
	}

	async handleEvent(payload: APIWebhookEvent) {
		if (payload.type !== ApplicationWebhookType.Event) return
		const listener = this.listeners.find((x) => x.type === payload.event.type)
		if (listener) listener.handle(payload.event.data, this.client)
	}
}
