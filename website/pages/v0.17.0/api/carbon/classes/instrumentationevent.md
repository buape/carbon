---
title: InstrumentationEvent
hidden: true
---

## Signature

```ts
type InstrumentationEvent = | {
			type: "operation.start"
			operation: InstrumentedOperation
	  }
	| {
			type: "operation.end"
			operation: InstrumentedOperation
			durationMs: number
			status: "success" | "error"
			statusCode?: number
			error?: unknown
	  }
	| {
			type: "event"
			name: string
			attributes: InstrumentationAttributes
	  }
```

