---
title: CommandExecutionStatus
description: Final execution status for a command invocation, passed to middleware `after` hooks.
hidden: true
---

## Signature

```ts
type CommandExecutionStatus = | "success"
	/** A middleware `before` hook returned `false`, so execution was blocked. */
	| "middleware-blocked"
	/** `preCheck()` returned something other than `true`, so execution was skipped. */
	| "precheck-failed"
	/** An error was thrown while executing command lifecycle logic. */
	| "error"
```


Final execution status for a command invocation, passed to middleware `after` hooks.
