---
title: Instrumentation
description: Runtime-neutral instrumentation hooks for observing Carbon operations.
hidden: true
---

## class `Instrumentation`

Runtime-neutral instrumentation hooks for observing Carbon operations.
Plugins can wrap operations (for example, to create active tracing spans)
and subscribe to lifecycle and framework events.

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| middlewares | `unknown` | Yes |  |
| listeners | `unknown` | Yes |  |
| nextOperationId | `unknown` | Yes |  |
| use | `(middleware: InstrumentationMiddleware) => () => void` | Yes | Add middleware that wraps every instrumented Carbon operation. Middleware should call `next()` exactly once and return its result. |
| onEvent | `(listener: (event: InstrumentationEvent) => void) => () => void` | Yes | Subscribe to operation lifecycle and framework events. |
| run | `(name: string, attributes: InstrumentationAttributes, callback: () => T | Promise<T>) => Promise<T>` | Yes | Run work inside the registered instrumentation middleware chain. |
| emit | `(name: string, attributes: InstrumentationAttributes) => void` | Yes | Emit a framework event that is not naturally represented by an operation. |
| dispatchEvent | `(event: InstrumentationEvent) => void` | Yes |  |
