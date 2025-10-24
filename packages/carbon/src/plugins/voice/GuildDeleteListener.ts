import type { Client } from "../../classes/Client.js"
import { GuildDeleteListener } from "../../classes/Listener.js"
import type { ListenerEventData } from "../../types/index.js"
import type { VoicePlugin } from "./VoicePlugin.js"

export class GuildDelete extends GuildDeleteListener {
	async handle(data: ListenerEventData[this["type"]], client: Client) {
		const voice = client.getPlugin<VoicePlugin>("voice")
		if (voice) {
			const guild_id = data.guild.id
			voice.adapters.get(guild_id)?.destroy()
		}
	}
}
