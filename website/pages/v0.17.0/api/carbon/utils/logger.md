---
title: Logger
description: Logger used by Carbon internals.
hidden: true
---

## Signature

```ts
type Logger = {
	/** Log debug-level diagnostic messages. */
	debug: (...data: unknown[]) => void
	/** Log informational messages. */
	info: (...data: unknown[]) => void
	/** Log warnings that do not stop execution. */
	warn: (...data: unknown[]) => void
	/** Log errors caught by Carbon internals. */
	error: (...data: unknown[]) => void
}
```


Logger used by Carbon internals.
Methods receive the same arguments Carbon would pass to the matching console method.

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| debug | `(...data: unknown[]) => void` | Yes | Log debug-level diagnostic messages. |
| info | `(...data: unknown[]) => void` | Yes | Log informational messages. |
| warn | `(...data: unknown[]) => void` | Yes | Log warnings that do not stop execution. |
| error | `(...data: unknown[]) => void` | Yes | Log errors caught by Carbon internals. |
