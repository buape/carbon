import {
	ApplicationIntegrationType,
	ApplicationWebhookEventType,
	Listener,
	type ListenerEventData
} from "@buape/carbon"

export class ApplicationAuthorizedListener extends Listener {
	type = ApplicationWebhookEventType.ApplicationAuthorized
	override async handle(
		data: ListenerEventData<ApplicationWebhookEventType.ApplicationAuthorized>
	) {
		if (data.integration_type === ApplicationIntegrationType.GuildInstall) {
			console.log(`Added to server ${data.guild?.name} (${data.guild?.id})`)
		} else {
			console.log(`Added to user ${data.user.username} (${data.user.id})`)
		}
	}
}
