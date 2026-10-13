---
title: CommandMiddlewareAfterContext
description: Context for middleware `after` hooks.
hidden: true
---

## Signature

```ts
type CommandMiddlewareAfterContext = CommandMiddlewareBaseContext & {
	/** Middleware phase marker. */
	phase: "after"
	/** Final command execution status. */
	status: CommandExecutionStatus
	/** Unix timestamp (milliseconds) captured at command lifecycle end. */
	endedAt: number
	/** Total command lifecycle duration in milliseconds. */
	durationMs: number
	/** Captured error when status is `error`. */
	error?: unknown
}
```


Context for middleware `after` hooks.
