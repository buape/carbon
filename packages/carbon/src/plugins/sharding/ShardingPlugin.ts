import { Plugin } from "../../abstracts/Plugin.js"
import type { Client } from "../../classes/Client.js"
import { GatewayPlugin } from "../gateway/GatewayPlugin.js"
import type { GatewayPluginOptions } from "../gateway/types.js"

export interface ShardingPluginOptions
	extends Omit<GatewayPluginOptions, "shard"> {
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

export class ShardingPlugin extends Plugin {
	readonly id = "sharding"
	protected client?: Client
	readonly shards: Map<number, GatewayPlugin> = new Map()
	readonly config: ShardingPluginOptions
	protected maxConcurrency: number
	protected spawnQueue: number[] = []
	protected spawning = false

	constructor(options: ShardingPluginOptions) {
		super()
		this.config = options
		this.maxConcurrency = options.maxConcurrency ?? 1
	}

	public async registerClient(client: Client): Promise<void> {
		this.client = client

		// If totalShards not provided, get recommended amount from Discord
		if (!this.config.totalShards) {
			try {
				const response = await fetch(
					"https://discord.com/api/v10/gateway/bot",
					{
						headers: {
							Authorization: `Bot ${client.options.token}`
						}
					}
				)
				const data = await response.json()
				this.config.totalShards = data.shards
				this.maxConcurrency = data.session_start_limit.max_concurrency
			} catch {
				throw new Error("Failed to get recommended shard count from Discord")
			}
		}

		const totalShards = this.config.totalShards
		if (!totalShards) {
			throw new Error(
				"Total shards must be specified or retrievable from Discord"
			)
		}

		// Determine which shards to spawn
		const shardsToSpawn =
			this.config.shardIds ?? Array.from({ length: totalShards }, (_, i) => i)

		// Queue all shards for spawning
		this.spawnQueue = [...shardsToSpawn]
		await this.processSpawnQueue()
	}

	protected async processSpawnQueue(): Promise<void> {
		if (this.spawning || this.spawnQueue.length === 0) return

		this.spawning = true
		const currentBatch: number[] = []

		// Process shards in batches based on maxConcurrency
		while (
			currentBatch.length < this.maxConcurrency &&
			this.spawnQueue.length > 0
		) {
			const shardId = this.spawnQueue.shift()
			if (shardId !== undefined) {
				currentBatch.push(shardId)
			}
		}

		const totalShards = this.config.totalShards
		if (!totalShards) return

		// Spawn the current batch of shards
		await Promise.all(
			currentBatch.map(async (shardId) => {
				const shard = new GatewayPlugin({
					...this.config,
					shard: [shardId, totalShards]
				})

				if (this.client) {
					shard.registerClient(this.client)
				}

				this.shards.set(shardId, shard)
			})
		)

		this.spawning = false

		// Continue processing if there are more shards to spawn
		if (this.spawnQueue.length > 0) {
			// Add a delay between batches to prevent rate limiting
			setTimeout(() => this.processSpawnQueue(), 5000)
		}
	}

	public disconnect(): void {
		for (const shard of this.shards.values()) {
			shard.disconnect()
		}
		this.shards.clear()
		this.spawnQueue = []
	}

	/**
	 * Calculate which shard a guild belongs to
	 */
	public getShardForGuild(guildId: string): GatewayPlugin | undefined {
		const totalShards = this.config.totalShards
		if (!totalShards) return undefined

		const shardId = this.calculateShardId(guildId, totalShards)
		return this.shards.get(shardId)
	}

	/**
	 * Discord's sharding formula
	 */
	protected calculateShardId(guildId: string, totalShards: number): number {
		if (!/^\d+$/.test(guildId)) {
			throw new Error("Invalid guild ID")
		}
		return Number((BigInt(guildId) >> 22n) % BigInt(totalShards))
	}
}
