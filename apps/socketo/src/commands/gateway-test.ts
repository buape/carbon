import { Command, type CommandInteraction } from "@buape/carbon"
import type { ShardingPlugin } from "@buape/carbon/sharding"

export default class GatewayTestCommand extends Command {
	name = "gateway-test"
	description = "Test gateway event sending functionality"

	async run(interaction: CommandInteraction) {
		const shardingPlugin =
			interaction.client.getPlugin<ShardingPlugin>("sharding")
		const gateway = interaction.guild
			? shardingPlugin?.getShardForGuild(interaction.guild.id)
			: shardingPlugin?.shards.values().next().value

		if (!gateway) {
			await interaction.reply("Gateway plugin not found")
			return
		}

		if (!gateway.isConnected) {
			await interaction.reply("Gateway is not connected")
			return
		}

		try {
			// Test 1: Update presence with minimal, valid data
			gateway.updatePresence({
				since: null,
				activities: [
					{
						name: "Carbon Test",
						type: 0 // Playing (most basic type)
					}
				],
				status: "online",
				afk: false
			})

			// Test 2: Get rate limit status
			const rateLimitStatus = gateway.getRateLimitStatus()

			// Test 2.5: Get intents info
			const intentsInfo = gateway.getIntentsInfo()

			// Test 3: Request guild members (if in a guild)
			if (interaction.guild) {
				gateway.requestGuildMembers({
					guild_id: interaction.guild.id,
					query: "",
					limit: 0,
					presences: false
				})
			}

			// Get shard info
			const shardInfo =
				interaction.guild && shardingPlugin?.config.totalShards
					? `Shard ${shardingPlugin.calculateShardId(interaction.guild.id, shardingPlugin.config.totalShards)}`
					: `Shard ${gateway.shardId ?? "unknown"}`

			const response = [
				"Gateway Events Test Results:",
				"",
				`**Shard**: ${shardInfo} (Total: ${shardingPlugin?.shards.size ?? 0} shards)`,
				`**Intents**: Members: ${intentsInfo.hasGuildMembers ? "✅" : "❌"}, Presences: ${intentsInfo.hasGuildPresences ? "✅" : "❌"}`,
				"**Presence Update**: Success - Status set to Online with 'Carbon Test'",
				`**Rate Limit**: ${rateLimitStatus.remainingEvents}/120 events remaining`,
				`**Reset Time**: ${rateLimitStatus.resetTime}ms`,
				interaction.guild
					? "**Guild Members**: Request sent"
					: "**Guild Members**: Skipped (not in guild)",
				"",
				"**All gateway event sending functionality is working with sharding!**"
			].join("\n")

			await interaction.reply(response)
		} catch (error) {
			await interaction.reply(
				`Gateway test failed: ${error instanceof Error ? error.message : String(error)}`
			)
		}
	}
}
