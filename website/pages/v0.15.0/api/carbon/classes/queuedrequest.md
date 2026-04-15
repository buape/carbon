---
title: QueuedRequest
hidden: true
---

## Signature

```ts
type QueuedRequest = {
	method: string
	path: string
	data?: RequestData
	query?: Record<string, string | number | boolean>
	resolve: (value?: unknown) => void
	reject: (reason?: unknown) => void
	routeKey: string
}
```


### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| method | `string` | Yes |  |
| path | `string` | Yes |  |
| data | `RequestData` | No |  |
| query | `Record<string, string | number | boolean>` | No |  |
| resolve | `(value?: unknown) => void` | Yes |  |
| reject | `(reason?: unknown) => void` | Yes |  |
| routeKey | `string` | Yes |  |
