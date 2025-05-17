import type { Client } from "../classes/Client.js"
import type { GuildMember } from "../structures/GuildMember.js"

export type CacheTypes = {
	user: Awaited<ReturnType<typeof Client.prototype.fetchUser>>
	guild: Awaited<ReturnType<typeof Client.prototype.fetchGuild>>
	channel: Awaited<ReturnType<typeof Client.prototype.fetchChannel>>
	role: Awaited<ReturnType<typeof Client.prototype.fetchRole>>
	member: Awaited<ReturnType<typeof Client.prototype.fetchMember>>
	message: Awaited<ReturnType<typeof Client.prototype.fetchMessage>>
	voiceState: Awaited<ReturnType<typeof GuildMember.prototype.getVoiceState>>
	permissions: bigint[]
}

type CacheEntry<T> = {
	value: T
	timestamp: number
}

export interface CacheOptions {
	/**
	 * Time in milliseconds after which cache entries expire
	 * @default 300000 (5 minutes)
	 */
	ttl: number
	/**
	 * Time in milliseconds between cleanup runs
	 * @default 600000 (10 minutes)
	 */
	cleanupInterval?: number
}

export class Cache {
	private options: CacheOptions
	private caches: {
		[K in keyof CacheTypes]: Map<string, CacheEntry<CacheTypes[K]>>
	} = {
		user: new Map(),
		guild: new Map(),
		channel: new Map(),
		role: new Map(),
		member: new Map(),
		message: new Map(),
		voiceState: new Map(),
		permissions: new Map()
	}
	private cleanupIntervalId?: NodeJS.Timeout

	constructor(options: Partial<CacheOptions> = {}) {
		this.options = {
			ttl: options.ttl ?? 300000, // 5 minutes default
			cleanupInterval: options.cleanupInterval ?? 600000 // 10 minutes default
		}
		this.scheduleCleanup(this.options.cleanupInterval)
	}

	/**
	 * Creates a composite key from multiple parts to be the caching key.
	 * This is in its own function to make it easier to override if needed.
	 * @param parts The parts to join into a composite key
	 * @returns A composite key string
	 */
	createCompositeKey(parts: string[]): string {
		return parts.join(":")
	}

	async get<T extends keyof CacheTypes>(
		type: T,
		key: string
	): Promise<CacheTypes[T] | undefined> {
		const entry = this.caches[type].get(key)
		if (!entry) return undefined

		// Check if entry is expired
		if (Date.now() - entry.timestamp > this.options.ttl) {
			this.caches[type].delete(key)
			return undefined
		}

		return entry.value
	}

	async set<T extends keyof CacheTypes>(
		type: T,
		key: string,
		value: CacheTypes[T]
	) {
		this.caches[type].set(key, {
			value,
			timestamp: Date.now()
		})
	}

	clearCache(type?: keyof CacheTypes) {
		if (type) {
			this.caches[type].clear()
		} else {
			for (const cache of Object.values(this.caches)) {
				cache.clear()
			}
		}
	}

	purgeCache(
		options: {
			type?: keyof CacheTypes
			before?: number
			after?: number
		} = {}
	) {
		const { type, before, after } = options
		const now = Date.now()

		const purgeMap = (
			map: Map<string, CacheEntry<CacheTypes[keyof CacheTypes]>>
		) => {
			for (const [key, entry] of map.entries()) {
				const timestamp = entry.timestamp
				if (
					(before && timestamp < before) ||
					(after && timestamp > after) ||
					now - timestamp > this.options.ttl
				) {
					map.delete(key)
				}
			}
		}

		if (type) {
			purgeMap(this.caches[type])
		} else {
			for (const cache of Object.values(this.caches)) {
				purgeMap(cache)
			}
		}
	}

	getCacheSize(type?: keyof CacheTypes): number {
		if (type) {
			return this.caches[type].size
		}
		return Object.values(this.caches).reduce(
			(acc, cache) => acc + cache.size,
			0
		)
	}

	hasCache(type: keyof CacheTypes, key: string): boolean {
		return this.get(type, key) !== undefined
	}

	/**
	 * Schedules periodic cleanup of expired cache entries
	 * @param interval Time in milliseconds between cleanup runs
	 * @default 60000 (1 minute)
	 */
	private scheduleCleanup(interval = 60000) {
		// Clear any existing interval
		if (this.cleanupIntervalId) {
			clearInterval(this.cleanupIntervalId)
		}

		this.cleanupIntervalId = setInterval(() => this.purgeCache(), interval)
	}

	/**
	 * Stops the periodic cleanup if it's running
	 */
	stopCleanup() {
		if (this.cleanupIntervalId) {
			clearInterval(this.cleanupIntervalId)
			this.cleanupIntervalId = undefined
		}
	}
}
