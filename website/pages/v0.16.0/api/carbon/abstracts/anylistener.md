---
title: AnyListener
hidden: true
---

## Signature

```ts
type AnyListener = {
	[TEvent in ListenerEventType]: BaseListener<TEvent>
}[ListenerEventType]
```

