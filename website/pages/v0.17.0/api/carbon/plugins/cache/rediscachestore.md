---
title: RedisCacheStore
hidden: true
---

## class `RedisCacheStore`

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| client | `RedisCacheClient` | Yes |  |
| prefix | `string` | Yes |  |
| ttl | `number` | Yes |  |
| maxSize | `number` | Yes |  |
| get | `(key: string) => Promise<T | undefined>` | Yes |  |
| set | `(key: string, value: T, options: CacheEntryOptions) => Promise<void>` | Yes |  |
| delete | `(key: string) => Promise<void>` | Yes |  |
| enforceMaxSize | `(key: string) => void` | Yes |  |
| command | `(command: string, args: string[]) => void` | Yes |  |
| deleteKey | `(key: string) => void` | Yes |  |
| key | `(key: string) => void` | Yes |  |
