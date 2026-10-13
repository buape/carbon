---
title: createBoundedExecutor
hidden: true
---

## Signature

```ts
createBoundedExecutor({
	concurrency,
	run,
	getQueuedAt
}: {
	concurrency: number
	run: (task: T) => Promise<void>
	getQueuedAt?: (task: T) => number | undefined
}): void
```


### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| {
	concurrency,
	run,
	getQueuedAt
} | `{
	concurrency: number
	run: (task: T) => Promise<void>
	getQueuedAt?: (task: T) => number | undefined
}` | Yes |  |

### Returns

`void`
