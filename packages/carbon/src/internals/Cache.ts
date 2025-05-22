import type { Client } from "../classes/Client.js"
import type { GuildMember } from "../structures/GuildMember.js"
import type { Webhook } from "../structures/Webhook.js"

export type CacheTypes = {
	user: Awaited<ReturnType<typeof Client.prototype.fetchUser>>
	guild: Awaited<ReturnType<typeof Client.prototype.fetchGuild>>
	channel: Awaited<ReturnType<typeof Client.prototype.fetchChannel>>
	role: Awaited<ReturnType<typeof Client.prototype.fetchRole>>
	member: Awaited<ReturnType<typeof Client.prototype.fetchMember>>
	message: Awaited<ReturnType<typeof Client.prototype.fetchMessage>>
	voiceState: Awaited<ReturnType<typeof GuildMember.prototype.getVoiceState>>
	permissions: bigint[]
	webhook: Webhook<false>
}

export interface CacheEntry<V> {
	value: V
	expiresAt?: number
}

export interface CacheOptions {
	defaultExpiry?: number
}

export class Cache<
	K extends keyof CacheTypes | string,
	V = K extends keyof CacheTypes ? CacheTypes[K] : unknown
> {
	private cache: Map<K, CacheEntry<V>> = new Map()
	private defaultExpiry: number = 1000 * 60 * 60 * 24 // 1 day

	constructor(options: CacheOptions = {}) {
		if (options.defaultExpiry) {
			this.defaultExpiry = options.defaultExpiry
		}
	}

	/**
	 * Get a value from the cache
	 * @param key The key to get
	 * @returns The value if it exists and hasn't expired, undefined otherwise
	 */
	public get(key: K): V | undefined {
		const entry = this.cache.get(key)
		if (!entry) return undefined

		if (entry.expiresAt && entry.expiresAt < Date.now()) {
			this.delete(key)
			return undefined
		}

		return entry.value
	}

	/**
	 * Set a value in the cache
	 * @param key The key to set
	 * @param value The value to set
	 * @param expiresIn Optional time in milliseconds until the entry expires
	 */
	public set(key: K, value: V, expiresIn?: number): void {
		const expiresAt = expiresIn ? Date.now() + expiresIn : this.defaultExpiry
		this.cache.set(key, { value, expiresAt })
	}

	/**
	 * Delete a value from the cache
	 * @param key The key to delete
	 * @returns Whether the key was deleted
	 */
	public delete(key: K): boolean {
		return this.cache.delete(key)
	}

	/**
	 * Clear all values of a specific type from the cache
	 * @param type The type to clear
	 */
	public clearType(type: K): void {
		for (const [key] of this.cache) {
			if (key === type) {
				this.delete(key)
			}
		}
	}

	/**
	 * Clear all values from the cache
	 */
	public clear(): void {
		this.cache.clear()
	}

	/**
	 * Get the size of the cache
	 */
	public get size(): number {
		return this.cache.size
	}

	/**
	 * Check if a key exists in the cache and hasn't expired
	 * @param key The key to check
	 */
	public has(key: K): boolean {
		const entry = this.cache.get(key)
		if (!entry) return false

		if (entry.expiresAt && entry.expiresAt < Date.now()) {
			this.delete(key)
			return false
		}

		return true
	}

	/**
	 * Get all keys in the cache that haven't expired
	 */
	public keys(): K[] {
		const keys: K[] = []
		for (const [key, entry] of this.cache) {
			if (entry.expiresAt && entry.expiresAt < Date.now()) {
				this.delete(key)
				continue
			}
			keys.push(key)
		}
		return keys
	}

	/**
	 * Get all values in the cache that haven't expired
	 */
	public values(): V[] {
		const values: V[] = []
		for (const [key, entry] of this.cache) {
			if (entry.expiresAt && entry.expiresAt < Date.now()) {
				this.delete(key)
				continue
			}
			values.push(entry.value)
		}
		return values
	}

	/**
	 * Get all entries in the cache that haven't expired
	 */
	public entries(): [K, V][] {
		const entries: [K, V][] = []
		for (const [key, entry] of this.cache) {
			if (entry.expiresAt && entry.expiresAt < Date.now()) {
				this.delete(key)
				continue
			}
			entries.push([key, entry.value])
		}
		return entries
	}
}
