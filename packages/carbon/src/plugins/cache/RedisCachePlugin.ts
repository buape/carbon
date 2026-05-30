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
	constructor({
		client,
		prefix = "carbon",
		...options
	}: RedisCachePluginOptions) {
		const store: CacheStoreFactory = <T>(
			type: CacheType,
			typeOptions: Required<CacheTypeOptions>
		) =>
			new RedisCacheStore<T>(client, {
				prefix: `${prefix}:${type}`,
				maxSize: typeOptions.maxSize,
				ttl: typeOptions.ttl
			})
		super({ ...options, store })
	}
}
