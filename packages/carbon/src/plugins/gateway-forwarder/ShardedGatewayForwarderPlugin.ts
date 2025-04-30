import { ShardingPlugin } from "../sharding/ShardingPlugin.js"
import type { GatewayForwarderPluginOptions } from "./GatewayForwarderPlugin.js"
import { GatewayForwarderPlugin } from "./GatewayForwarderPlugin.js"

export interface ShardedGatewayForwarderPluginOptions
	extends Omit<GatewayForwarderPluginOptions, "shard"> {
	/**
	 * If not provided, will use Discord's recommended amount
	 */
	totalShards?: number
	/**
	 * Specific shard IDs to spawn, if not provided will spawn all shards
	 */
	shardIds?: number[]
	/**
	 * Maximum number of shards to spawn concurrently
	 */
	maxConcurrency?: number
}

export class ShardedGatewayForwarderPlugin extends ShardingPlugin {
	customGatewayPlugin = GatewayForwarderPlugin
}
