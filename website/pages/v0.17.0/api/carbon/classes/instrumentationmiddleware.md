---
title: InstrumentationMiddleware
hidden: true
---

## Signature

```ts
type InstrumentationMiddleware = <T>(
	operation: InstrumentedOperation,
	next: () => Promise<T>
) => Promise<T>
```

