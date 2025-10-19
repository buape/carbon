import type {
	DiscordGatewayAdapterCreator,
	DiscordGatewayAdapterImplementerMethods,
	DiscordGatewayAdapterLibraryMethods
} from "@discordjs/voice"
import type { BaseListener } from "../../abstracts/BaseListener.js"
import { Plugin } from "../../abstracts/Plugin.js"
import type { Client } from "../../classes/Client.js"
import type { GatewayPlugin } from "../gateway/index.js"
import type { GatewayPayload, ShardingPlugin } from "../sharding/index.js"
import { GuildDelete } from "./GuildDeleteListener.js"

export class VoicePlugin extends Plugin {
	readonly id = "voice"
	protected client?: Client
	readonly adapters: Map<string, DiscordGatewayAdapterLibraryMethods> =
		new Map()
	private shardingPlugin?: ShardingPlugin
	private gatewayPlugin?: GatewayPlugin

	public async registerClient(client: Client): Promise<void> {
		this.client = client
		const sharding = this.client.getPlugin<ShardingPlugin>("sharding")
		if (sharding) {
			this.shardingPlugin = sharding
		}
		const gateway = this.client.getPlugin<GatewayPlugin>("gateway")
		if (gateway) {
			this.gatewayPlugin = gateway
		}
		if (!this.gatewayPlugin && !this.shardingPlugin) {
			throw new Error("Voice cannot be used without a gateway connection.")
		}
		this.client.listeners.push(new GuildDelete() as BaseListener)
	}

	getGateway(guild_id: string) {
		if (this.shardingPlugin) {
			return this.shardingPlugin.getShardForGuild(guild_id)
		}
		return this.gatewayPlugin
	}

	getGatewayAdapterCreator(guild_id: string): DiscordGatewayAdapterCreator {
		const gateway = this.getGateway(guild_id)

		if (!gateway) {
			throw new Error("Voice cannot be used without a gateway connection.")
		}

		return (
			methods: DiscordGatewayAdapterLibraryMethods
		): DiscordGatewayAdapterImplementerMethods => {
			this.adapters.set(guild_id, methods)
			return {
				sendPayload(payload: GatewayPayload): boolean {
					gateway.send(payload, true)
					return true
				},
				destroy: (): void => {
					this.adapters.delete(guild_id)
				}
			}
		}
	}
}
