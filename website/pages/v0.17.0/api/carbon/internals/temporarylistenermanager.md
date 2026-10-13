---
title: TemporaryListenerManager
hidden: true
---

## class `TemporaryListenerManager`

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| client | `Client` | Yes |  |
| listeners | `Map<string, TemporaryListenerEntry>` | Yes |  |
| defaultTimeout | `number` | Yes |  |
| register | `(listener: AnyListener, timeoutMs: number) => () => void` | Yes |  |
| unregister | `(id: string | AnyListener) => boolean` | Yes |  |
| generateId | `(listener: AnyListener) => string` | Yes |  |
| getCount | `() => number` | Yes |  |
| cleanup | `() => void` | Yes |  |
| getMetrics | `() => void` | Yes |  |
