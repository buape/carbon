import type { GatewayVoiceStateUpdateDispatchData } from "discord-api-types/v10"
import type { Client } from "../../classes/Client.js"
import { VoiceStateUpdateListener } from "../../classes/Listener.js"
import type { ListenerEventData } from "../../types/index.js"
import type { VoicePlugin } from "./VoicePlugin.js"

/**
 * Forwards VOICE_STATE_UPDATE events to voice adapters.
 */
export class VoiceStateUpdate extends VoiceStateUpdateListener {
	async handle(data: ListenerEventData[this["type"]], client: Client) {
		const voice = client.getPlugin<VoicePlugin>("voice")
		if (!voice) return
		const guildId = data.guild_id
		if (guildId) {
			// Reconstruct raw payload for @discordjs/voice adapter
			const raw: GatewayVoiceStateUpdateDispatchData = {
				...data,
				member: data.rawMember
			}
			voice.adapters.get(guildId)?.onVoiceStateUpdate(raw)
		}
	}
}
