---
title: CommandMiddlewareBaseContext
description: Shared context provided to command middleware hooks.
hidden: true
---

## Signature

```ts
type CommandMiddlewareBaseContext = {
	/** Carbon client handling the command. */
	client: Client
	/** Resolved command instance being executed (including subcommands). */
	command: Command
	/** Parsed command interaction wrapper for the current invocation. */
	interaction: CommandInteraction
	/** Unix timestamp (milliseconds) captured at command lifecycle start. */
	startedAt: number
}
```


Shared context provided to command middleware hooks.

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| client | `Client` | Yes | Carbon client handling the command. |
| command | `Command` | Yes | Resolved command instance being executed (including subcommands). |
| interaction | `CommandInteraction` | Yes | Parsed command interaction wrapper for the current invocation. |
| startedAt | `number` | Yes | Unix timestamp (milliseconds) captured at command lifecycle start. |
