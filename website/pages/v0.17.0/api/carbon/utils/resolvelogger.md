---
title: resolveLogger
description: Resolve a partial logger into a complete logger.
hidden: true
---

## Signature

```ts
const resolveLogger: (logger?: LoggerOptions): Logger => ({
	...defaultLogger,
	...logger
})
```


Resolve a partial logger into a complete logger.
