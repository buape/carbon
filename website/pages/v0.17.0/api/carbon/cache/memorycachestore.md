---
title: MemoryCacheStore
hidden: true
---

## class `MemoryCacheStore`

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| entries | `unknown` | Yes |  |
| maxSize | `number` | Yes |  |
| ttl | `number` | Yes |  |
| get | `(key: string) => T | undefined` | Yes |  |
| set | `(key: string, value: T, options: CacheEntryOptions) => void` | Yes |  |
| has | `(key: string) => boolean` | Yes |  |
| delete | `(key: string) => boolean` | Yes |  |
| clear | `() => void` | Yes |  |
| expired | `(entry: MemoryEntry<T>) => void` | Yes |  |
