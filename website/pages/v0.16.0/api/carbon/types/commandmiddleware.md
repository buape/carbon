---
title: CommandMiddleware
hidden: true
---

## Signature

```ts
type CommandMiddleware = {
	/**
	 * Runs before command execution (`defer`, `preCheck`, and `run`).
	 * Return `false` to block command execution.
	 */
	before?(
		context: Readonly<CommandMiddlewareBeforeContext>
	): boolean | undefined | Promise<boolean | undefined>
	/**
	 * Runs after command execution completes
	 */
	after?(
		context: Readonly<CommandMiddlewareAfterContext>
	): Promise<void> | undefined
}
```

