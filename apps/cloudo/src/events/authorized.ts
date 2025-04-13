import {
	ApplicationIntegrationType,
	type Client,
	Listener,
	ListenerEvent,
	type ListenerEventData,
	type ValueOf
} from "@buape/carbon"

export default class ApplicationAuthorizedListener extends Listener {
	readonly type = ListenerEvent.ApplicationAuthorized
	async handle(
		data: ListenerEventData[typeof ListenerEvent.ApplicationAuthorized]
	) {
		if (data.integration_type === ApplicationIntegrationType.GuildInstall) {
			console.log(`Added to server ${data.guild?.name} (${data.guild?.id})`)
		} else {
			console.log(`Added to user ${data.user.username} (${data.user.id})`)
		}
	}
}
