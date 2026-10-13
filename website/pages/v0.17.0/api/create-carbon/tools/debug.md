---
title: debug
description: Logs the provided arguments to the console if the DEBUG environment variable is set.
hidden: true
---

## Signature

```ts
const debug: (...args: unknown[]) => {
	if (isTruthy(process.env.DEBUG) || process.env.NODE_ENV === "development")
		console.log(...args)
}
```


Logs the provided arguments to the console if the DEBUG environment variable is set.
