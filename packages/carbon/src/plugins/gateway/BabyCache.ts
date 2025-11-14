// I called this the BabyCache because eventually, one way, carbon will have a more
// proper caching setup. For now, this is the toddler of that cache.

interface GuildCacheEntry {
	available: boolean
	lastEvent: number
}

export class BabyCache {
	guildCache: Map<string, GuildCacheEntry> = new Map()
	private readonly maxGuilds: number
	private readonly ttl: number

	constructor(maxGuilds = 5000, ttl = 86400000) {
		this.maxGuilds = maxGuilds
		this.ttl = ttl
	}

	setGuild(guildId: string, entry: GuildCacheEntry) {
		if (
			this.guildCache.size >= this.maxGuilds &&
			!this.guildCache.has(guildId)
		) {
			let oldestId: string | null = null
			let oldestTime = Number.POSITIVE_INFINITY

			for (const [id, guild] of this.guildCache.entries()) {
				if (guild.lastEvent < oldestTime) {
					oldestTime = guild.lastEvent
					oldestId = id
				}
			}

			if (oldestId) {
				this.guildCache.delete(oldestId)
			}
		}

		this.guildCache.set(guildId, entry)
	}

	getGuild(guildId: string): GuildCacheEntry | undefined {
		const entry = this.guildCache.get(guildId)

		if (!entry) return undefined

		if (Date.now() - entry.lastEvent > this.ttl) {
			this.guildCache.delete(guildId)
			return undefined
		}

		return entry
	}

	removeGuild(guildId: string): boolean {
		return this.guildCache.delete(guildId)
	}

	cleanup(): number {
		const now = Date.now()
		let removed = 0

		for (const [id, entry] of this.guildCache.entries()) {
			if (now - entry.lastEvent > this.ttl) {
				this.guildCache.delete(id)
				removed++
			}
		}

		return removed
	}
}
