import { Command, type CommandInteraction } from "@buape/carbon"
import type { ShardingPlugin } from "@buape/carbon/sharding"

export default class PingCommand extends Command {
	name = "ping"
	description = "Replies with Pong!"

	async run(interaction: CommandInteraction) {
		// Test gateway event sending functionality with sharding
		const shardingPlugin =
			interaction.client.getPlugin<ShardingPlugin>("sharding")

		interaction.reply(
			`Pong!\n${Object.entries(shardingPlugin?.ping ?? {})
				.map(([shard, ping]) => `Shard ${shard}: ${ping}ms`)
				.join("\n")}`
		)
	}
}
