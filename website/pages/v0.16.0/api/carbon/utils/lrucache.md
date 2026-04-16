---
title: LRUCache
description: Simple LRU (Least Recently Used) cache implementation
hidden: true
---

## class `LRUCache`

Simple LRU (Least Recently Used) cache implementation
Automatically evicts least recently used items when capacity is reached

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| cache | `Map<K, V>` | Yes |  |
| maxSize | `number` | Yes |  |
| get | `(key: K) => V | undefined` | Yes | Get a value from the cache @param key The key to retrieve @returns The value if found, undefined otherwise |
| set | `(key: K, value: V) => void` | Yes | Set a value in the cache @param key The key to set @param value The value to store |
| has | `(key: K) => boolean` | Yes | Check if a key exists in the cache @param key The key to check @returns true if the key exists |
| delete | `(key: K) => boolean` | Yes | Delete a key from the cache @param key The key to delete @returns true if the key was deleted |
| values | `() => IterableIterator<V>` | Yes | Get all values in the cache |
| clear | `() => void` | Yes | Clear all entries from the cache |
