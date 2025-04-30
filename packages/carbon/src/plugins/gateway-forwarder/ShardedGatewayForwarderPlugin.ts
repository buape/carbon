import {
	ShardingPlugin,
	type ShardingPluginOptions
} from "../sharding/ShardingPlugin.js"
import type { GatewayForwarderPluginOptions } from "./GatewayForwarderPlugin.js"
import { GatewayForwarderPlugin } from "./GatewayForwarderPlugin.js"

export type ShardedGatewayForwarderPluginOptions =
	GatewayForwarderPluginOptions & ShardingPluginOptions

export class ShardedGatewayForwarderPlugin extends ShardingPlugin {
	// biome-ignore lint/complexity/noUselessConstructor:
	constructor(options: ShardedGatewayForwarderPluginOptions) {
		super(options)
	}

	customGatewayPlugin = GatewayForwarderPlugin
}
