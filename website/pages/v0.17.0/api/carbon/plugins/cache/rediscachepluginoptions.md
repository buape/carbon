---
title: RedisCachePluginOptions
hidden: true
---

## Signature

```ts
type RedisCachePluginOptions = Omit<CacheManagerOptions, "store"> & {
	client: RedisCacheClient
	prefix?: string
}
```

