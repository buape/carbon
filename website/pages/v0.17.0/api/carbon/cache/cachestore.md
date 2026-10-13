---
title: CacheStore
hidden: true
---

## Signature

```ts
type CacheStore = {
	get(key: string): MaybePromise<T | undefined | null>
	set(key: string, value: T, options?: CacheEntryOptions): MaybePromise<unknown>
	delete(key: string): MaybePromise<unknown>
	has?(key: string): MaybePromise<boolean>
	clear?(): MaybePromise<unknown>
}
```

