import type { CacheEntryOptions, CacheStore } from "../../cache/types.js"

export type RedisCacheClient = {
	get(
		key: string
	): Promise<string | null | undefined> | string | null | undefined
	set(
		key: string,
		value: string,
		...args: unknown[]
	): Promise<unknown> | unknown
	del?(key: string): Promise<unknown> | unknown
	delete?(key: string): Promise<unknown> | unknown
	expire?(key: string, seconds: number): Promise<unknown> | unknown
	sendCommand?: unknown
	call?(command: string, ...args: string[]): Promise<unknown> | unknown
}

export class RedisCacheStore<T> implements CacheStore<T> {
	private readonly client: RedisCacheClient
	private readonly prefix: string
	private readonly ttl: number
	private readonly maxSize: number

	constructor(
		client: RedisCacheClient,
		options: { prefix?: string; ttl?: number; maxSize?: number } = {}
	) {
		this.client = client
		this.prefix = options.prefix ?? "carbon"
		this.ttl = options.ttl ?? 0
		this.maxSize = options.maxSize ?? 0
		if (
			this.maxSize > 0 &&
			typeof this.client.sendCommand !== "function" &&
			!this.client.call
		)
			throw new Error(
				"Redis cache maxSize requires a client with sendCommand or call support"
			)
	}

	async get(key: string): Promise<T | undefined> {
		const value = await this.client.get(this.key(key))
		if (!value) return undefined
		return JSON.parse(value) as T
	}

	async set(
		key: string,
		value: T,
		options: CacheEntryOptions = {}
	): Promise<void> {
		const ttl = options.ttl ?? this.ttl
		const serialized = JSON.stringify(value)
		if (ttl <= 0) {
			await this.client.set(this.key(key), serialized)
			await this.enforceMaxSize(key)
			return
		}

		const seconds = Math.max(1, Math.ceil(ttl / 1000))
		try {
			await this.client.set(this.key(key), serialized, { EX: seconds })
		} catch (error) {
			try {
				await this.client.set(this.key(key), serialized, "EX", seconds)
			} catch (_) {
				throw error
			}
		}
		await this.enforceMaxSize(key)
	}

	async delete(key: string): Promise<void> {
		await this.command("ZREM", this.indexKey, key)
		await this.deleteKey(this.key(key))
	}

	private async enforceMaxSize(key: string) {
		if (this.maxSize <= 0) return
		await this.command("ZADD", this.indexKey, Date.now().toString(), key)
		const count = await this.command("ZCARD", this.indexKey)
		if (typeof count !== "number" || count <= this.maxSize) return
		const overflow = count - this.maxSize
		const removed = await this.command(
			"ZPOPMIN",
			this.indexKey,
			overflow.toString()
		)
		if (!Array.isArray(removed)) return
		for (let index = 0; index < removed.length; index += 2) {
			const oldKey = removed[index]
			if (typeof oldKey === "string") await this.deleteKey(this.key(oldKey))
		}
	}

	private async command(command: string, ...args: string[]) {
		if (this.client.call) return this.client.call(command, ...args)
		if (typeof this.client.sendCommand !== "function") return undefined
		return (this.client.sendCommand as (args: string[]) => unknown)([
			command,
			...args
		])
	}

	private async deleteKey(key: string) {
		if (this.client.del) {
			await this.client.del(key)
			return
		}
		await this.client.delete?.(key)
	}

	private get indexKey() {
		return `${this.prefix}:__keys`
	}

	private key(key: string) {
		return `${this.prefix}:${key}`
	}
}
