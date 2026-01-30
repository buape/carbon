import type { Client } from "../../classes/Client.js"
import { VoiceServerUpdateListener } from "../../classes/Listener.js"
import type { ListenerEventData } from "../../types/index.js"
import type { VoicePlugin } from "./VoicePlugin.js"

/**
 * Forwards VOICE_SERVER_UPDATE events to voice adapters.
 */
export class VoiceServerUpdate extends VoiceServerUpdateListener {
	async handle(data: ListenerEventData[this["type"]], client: Client) {
		const voice = client.getPlugin<VoicePlugin>("voice")
		if (!voice) return
		const guildId = data.guild_id
		if (guildId) {
			voice.adapters.get(guildId)?.onVoiceServerUpdate(data)
		}
	}
}
