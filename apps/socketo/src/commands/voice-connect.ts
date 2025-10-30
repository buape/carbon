import { Command, type CommandInteraction } from "@buape/carbon"
import type { VoicePlugin } from "@buape/carbon/voice"
import {
	entersState,
	getVoiceConnection,
	joinVoiceChannel,
	VoiceConnectionStatus
} from "@discordjs/voice"

export default class VoiceConnectCommand extends Command {
	name = "voice-connect"
	description = "Connects to your current voice channel"
	defer = true

	async run(interaction: CommandInteraction) {
		const voicePlugin = interaction.client.getPlugin<VoicePlugin>("voice")

		if (!voicePlugin) {
			return interaction.reply({ content: "Voice plugin not found" })
		}

		if (!interaction.guild || !interaction.member) {
			return interaction.reply({
				content: "You need to use this command in a guild"
			})
		}

		const voiceState = await interaction.member.getVoiceState()
		if (!voiceState || !voiceState.channelId) {
			return interaction.reply({
				content: "You're not in a voice channel"
			})
		}

		const existing = getVoiceConnection(interaction.guild.id)
		if (existing) {
			existing.disconnect()
			existing.destroy()
		}

		const connection = joinVoiceChannel({
			adapterCreator: voicePlugin.getGatewayAdapterCreator(
				interaction.guild.id
			),
			channelId: voiceState.channelId,
			guildId: interaction.guild.id,
			selfDeaf: false,
			selfMute: true
		})

		await entersState(connection, VoiceConnectionStatus.Ready, 20_000)
		await interaction.reply({ content: "Connected!" })
	}
}
