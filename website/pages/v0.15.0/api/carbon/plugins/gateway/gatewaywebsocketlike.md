---
title: GatewayWebSocketLike
hidden: true
---

## Signature

```ts
type GatewayWebSocketLike = {
	readyState: number
	send(data: string): void
	close(code?: number, reason?: string): void
	terminate?: () => void
	on?: (
		event: "open" | "message" | "close" | "error",
		listener: (...args: unknown[]) => void
	) => void
	addEventListener?: (
		event: "open" | "message" | "close" | "error",
		listener: (event: unknown) => void
	) => void
}
```


### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| readyState | `number` | Yes |  |
| terminate | `() => void` | No |  |
| on | `(
		event: "open" | "message" | "close" | "error",
		listener: (...args: unknown[]) => void
	) => void` | No |  |
| addEventListener | `(
		event: "open" | "message" | "close" | "error",
		listener: (event: unknown) => void
	) => void` | No |  |
