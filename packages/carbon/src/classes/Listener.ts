import type {
	APIWebhookEventApplicationAuthorizedData,
	APIWebhookEventEntitlementCreateData,
	ApplicationWebhookEventType
} from "discord-api-types/v10"
import type { Client } from "./Client.js"

export type ListenerEventData<T extends ApplicationWebhookEventType> =
	T extends ApplicationWebhookEventType.ApplicationAuthorized
		? APIWebhookEventApplicationAuthorizedData
		: T extends ApplicationWebhookEventType.EntitlementCreate
			? APIWebhookEventEntitlementCreateData
			: never

export abstract class Listener {
	abstract type: ApplicationWebhookEventType
	abstract handle(
		data: ListenerEventData<typeof this.type>,
		client: Client
	): Promise<void>
}
