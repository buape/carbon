import type {
	CacheManagerOptions,
	CacheStoreFactory,
	CacheType,
	CacheTypeOptions
} from "../../cache/types.js"
import { CachePlugin } from "./CachePlugin.js"
import { type RedisCacheClient, RedisCacheStore } from "./RedisCacheStore.js"

export type RedisCachePluginOptions = Omit<CacheManagerOptions, "store"> & {
	client: RedisCacheClient
	prefix?: string
}

export class RedisCachePlugin extends CachePlugin {
	constructor(options: RedisCachePluginOptions) {
		const store: CacheStoreFactory = <T>(
			type: CacheType,
			typeOptions: Required<CacheTypeOptions>
		) =>
			new RedisCacheStore<T>(options.client, {
				prefix: [options.prefix ?? "carbon", type].join(":"),
				maxSize: typeOptions.maxSize,
				ttl: typeOptions.ttl
			})
		const cacheOptions: CacheManagerOptions = {
			...options,
			store
		}
		delete (cacheOptions as { client?: RedisCacheClient }).client
		delete (cacheOptions as { prefix?: string }).prefix
		super(cacheOptions)
	}
}
