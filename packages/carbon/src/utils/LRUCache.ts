/**
 * Simple LRU (Least Recently Used) cache implementation
 * Automatically evicts least recently used items when capacity is reached
 */
export class LRUCache<K, V> {
	private cache: Map<K, V>
	private readonly maxSize: number

	constructor(maxSize = 10000) {
		this.cache = new Map()
		this.maxSize = maxSize
	}

	/**
	 * Get a value from the cache
	 * @param key The key to retrieve
	 * @returns The value if found, undefined otherwise
	 */
	get(key: K): V | undefined {
		const value = this.cache.get(key)
		if (value !== undefined) {
			// Move to end (most recently used)
			this.cache.delete(key)
			this.cache.set(key, value)
		}
		return value
	}

	/**
	 * Set a value in the cache
	 * @param key The key to set
	 * @param value The value to store
	 */
	set(key: K, value: V): void {
		// Delete if exists to reinsert at end
		this.cache.delete(key)

		// Evict least recently used if at capacity
		if (this.cache.size >= this.maxSize) {
			const firstKey = this.cache.keys().next().value
			if (firstKey !== undefined) {
				this.cache.delete(firstKey)
			}
		}

		this.cache.set(key, value)
	}

	/**
	 * Check if a key exists in the cache
	 * @param key The key to check
	 * @returns true if the key exists
	 */
	has(key: K): boolean {
		return this.cache.has(key)
	}

	/**
	 * Delete a key from the cache
	 * @param key The key to delete
	 * @returns true if the key was deleted
	 */
	delete(key: K): boolean {
		return this.cache.delete(key)
	}

	/**
	 * Get the current size of the cache
	 */
	get size(): number {
		return this.cache.size
	}

	/**
	 * Get all values in the cache
	 */
	values(): IterableIterator<V> {
		return this.cache.values()
	}

	/**
	 * Clear all entries from the cache
	 */
	clear(): void {
		this.cache.clear()
	}
}
