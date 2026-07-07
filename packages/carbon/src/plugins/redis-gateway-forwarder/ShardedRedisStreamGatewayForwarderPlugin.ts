import {
	ShardingPlugin,
	type ShardingPluginOptions
} from "../sharding/ShardingPlugin.js"
import type { RedisStreamGatewayForwarderPluginOptions } from "./RedisStreamGatewayForwarderPlugin.js"
import { RedisStreamGatewayForwarderPlugin } from "./RedisStreamGatewayForwarderPlugin.js"

export type ShardedRedisStreamGatewayForwarderPluginOptions =
	RedisStreamGatewayForwarderPluginOptions & ShardingPluginOptions

export class ShardedRedisStreamGatewayForwarderPlugin extends ShardingPlugin {
	override readonly id = "sharded-redis-gateway-forwarder" as "sharding"

	customGatewayPlugin = RedisStreamGatewayForwarderPlugin
}
