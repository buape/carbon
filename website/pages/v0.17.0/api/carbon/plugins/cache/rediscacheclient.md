---
title: RedisCacheClient
hidden: true
---

## Signature

```ts
type RedisCacheClient = {
	get(
		key: string
	): Promise<string | null | undefined> | string | null | undefined
	set(
		key: string,
		value: string,
		...args: unknown[]
	): Promise<unknown> | unknown
	del?(key: string): Promise<unknown> | unknown
	delete?(key: string): Promise<unknown> | unknown
	expire?(key: string, seconds: number): Promise<unknown> | unknown
	sendCommand?: unknown
	call?(command: string, ...args: string[]): Promise<unknown> | unknown
}
```


### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| sendCommand | `unknown` | No |  |
