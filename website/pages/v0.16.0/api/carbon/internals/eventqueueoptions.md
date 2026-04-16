---
title: EventQueueOptions
hidden: true
---

## interface `EventQueueOptions`

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| runtimeProfile | `RuntimeProfile` | No |  |
| lanes | `Partial<Record<EventQueueLane, EventQueueLaneOptions>>` | No |  |
| maxQueueSize | `number` | No | Global fallback maximum queue size. |
| maxConcurrency | `number` | No | Global fallback max event concurrency. |
| listenerTimeout | `number` | No | Global fallback listener timeout. |
| listenerConcurrency | `number` | No | Global fallback per-event listener concurrency. |
| yieldIntervalMs | `number` | No |  |
| logSlowListeners | `boolean` | No | Whether to log slow listeners @default true |
| slowListenerThreshold | `number` | No | Threshold (in ms) for logging slow listeners @default 1000 (1 second) |
