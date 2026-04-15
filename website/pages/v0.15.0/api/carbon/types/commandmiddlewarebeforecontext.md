---
title: CommandMiddlewareBeforeContext
description: Context for middleware `before` hooks.
hidden: true
---

## Signature

```ts
type CommandMiddlewareBeforeContext = CommandMiddlewareBaseContext & {
	/** Middleware phase marker. */
	phase: "before"
	/** Lifecycle status while running pre-execution middleware. */
	status: "running"
}
```


Context for middleware `before` hooks.
