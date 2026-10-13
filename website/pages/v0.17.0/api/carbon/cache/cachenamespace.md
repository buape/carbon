---
title: CacheNamespace
hidden: true
---

## class `CacheNamespace`

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| enabled | `boolean` | Yes |  |
| options | `Required<CacheTypeOptions>` | Yes |  |
| store | `CacheStore<T>` | No |  |
| get | `(key: string) => Promise<T | undefined>` | Yes |  |
| set | `(key: string, value: T) => Promise<void>` | Yes |  |
| delete | `(key: string) => Promise<void>` | Yes |  |
| has | `(key: string) => Promise<boolean>` | Yes |  |
| clear | `() => Promise<void>` | Yes |  |
