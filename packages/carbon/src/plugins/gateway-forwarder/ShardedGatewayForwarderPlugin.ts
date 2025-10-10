import {
	ShardingPlugin,
	type ShardingPluginOptions
} from "../sharding/ShardingPlugin.js"
import type { GatewayForwarderPluginOptions } from "./GatewayForwarderPlugin.js"
import { GatewayForwarderPlugin } from "./GatewayForwarderPlugin.js"

export type ShardedGatewayForwarderPluginOptions =
	GatewayForwarderPluginOptions & ShardingPluginOptions

export class ShardedGatewayForwarderPlugin extends ShardingPlugin {
	override readonly id = "sharded-gateway-forwarder" as "sharding"

	customGatewayPlugin = GatewayForwarderPlugin
}
