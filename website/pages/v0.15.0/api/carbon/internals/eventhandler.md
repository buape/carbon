---
title: EventHandler
description: Handles Discord gateway events and dispatches them to registered listeners.
hidden: true
---

## class `EventHandler`

Handles Discord gateway events and dispatches them to registered listeners.

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| eventQueue | `EventQueue` | Yes |  |
| handleEvent | `(payload: ListenerEventRawData[T] & ListenerEventAdditionalData, type: T) => boolean` | Yes |  |
| getMetrics | `() => void` | Yes |  |
| hasCapacity | `() => boolean` | Yes |  |
