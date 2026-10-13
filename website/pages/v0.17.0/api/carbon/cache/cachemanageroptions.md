---
title: CacheManagerOptions
hidden: true
---

## Signature

```ts
type CacheManagerOptions = {
	enabled?: boolean
	default?: CacheTypeOptions
	types?: Partial<Record<CacheType, CacheTypeOptions | false>>
	store?: CacheStoreFactory
	stores?: Partial<{
		[TType in CacheType]: CacheStore<CachePayloadMap[TType]>
	}>
}
```


### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| enabled | `boolean` | No |  |
| default | `CacheTypeOptions` | No |  |
| types | `Partial<Record<CacheType, CacheTypeOptions | false>>` | No |  |
| store | `CacheStoreFactory` | No |  |
| stores | `Partial<{
		[TType in CacheType]: CacheStore<CachePayloadMap[TType]>
	}>` | No |  |
