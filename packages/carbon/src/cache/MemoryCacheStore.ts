import type { CacheEntryOptions, CacheStore } from "./types.js"

type MemoryEntry<T> = {
	value: T
	expiresAt: number | null
}

export class MemoryCacheStore<T> implements CacheStore<T> {
	private readonly entries = new Map<string, MemoryEntry<T>>()
	private readonly maxSize: number
	private readonly ttl: number

	constructor(options: { maxSize?: number; ttl?: number } = {}) {
		this.maxSize = options.maxSize ?? 10_000
		this.ttl = options.ttl ?? 0
	}

	get(key: string): T | undefined {
		const entry = this.entries.get(key)
		if (!entry) return undefined
		if (this.expired(entry)) {
			this.entries.delete(key)
			return undefined
		}
		this.entries.delete(key)
		this.entries.set(key, entry)
		return entry.value
	}

	set(key: string, value: T, options: CacheEntryOptions = {}): void {
		this.entries.delete(key)
		while (this.entries.size >= this.maxSize) {
			const oldestKey = this.entries.keys().next().value
			if (!oldestKey) break
			this.entries.delete(oldestKey)
		}
		const ttl = options.ttl ?? this.ttl
		this.entries.set(key, {
			value,
			expiresAt: ttl > 0 ? Date.now() + ttl : null
		})
	}

	has(key: string): boolean {
		return this.get(key) !== undefined
	}

	delete(key: string): boolean {
		return this.entries.delete(key)
	}

	clear(): void {
		this.entries.clear()
	}

	get size(): number {
		return this.entries.size
	}

	private expired(entry: MemoryEntry<T>) {
		return entry.expiresAt !== null && entry.expiresAt <= Date.now()
	}
}
