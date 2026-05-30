import { Plugin } from "../../abstracts/Plugin.js"
import { CacheManager } from "../../cache/CacheManager.js"
import type { CacheManagerOptions } from "../../cache/types.js"
import type { Client } from "../../classes/Client.js"

export class CachePlugin extends Plugin {
	readonly id = "cache"
	private readonly options: CacheManagerOptions

	constructor(options: CacheManagerOptions = {}) {
		super()
		this.options = options
	}

	registerClient(client: Client): void {
		client.setCache(new CacheManager({ enabled: true, ...this.options }))
	}
}

export class MemoryCachePlugin extends CachePlugin {}
