import {
	ApplicationAuthorizedListener,
	ApplicationIntegrationType,
	type ListenerEventData
} from "@buape/carbon"

export class ApplicationAuthorized extends ApplicationAuthorizedListener {
	async handle(data: ListenerEventData[this["type"]]) {
		if (data.integration_type === ApplicationIntegrationType.GuildInstall) {
			console.log(`Added to server ${data.guild?.name} (${data.guild?.id})`)
		} else {
			console.log(`Added to user ${data.user.username} (${data.user.id})`)
		}
	}
}
