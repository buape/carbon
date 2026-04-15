---
title: EventQueue
hidden: true
---

## class `EventQueue`

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| client | `Client` | Yes |  |
| queues | `Record<
		EventQueueLane,
		QueuedEvent<keyof ListenerEventRawData>[]
	>` | Yes |  |
| processingByLane | `unknown` | Yes |  |
| options | `{
		lanes: Record<EventQueueLane, Required<EventQueueLaneOptions>>
		yieldIntervalMs: number
		logSlowListeners: boolean
		slowListenerThreshold: number
	}` | Yes |  |
| lastYieldAt | `unknown` | Yes |  |
| processedCount | `unknown` | Yes |  |
| droppedCount | `unknown` | Yes |  |
| droppedStaleCount | `unknown` | Yes |  |
| timeoutCount | `unknown` | Yes |  |
| zombieExecutionCount | `unknown` | Yes |  |
| enqueue | `(payload: ListenerEventRawData[T] & ListenerEventAdditionalData, type: T) => boolean` | Yes |  |
| processLane | `(lane: EventQueueLane) => void` | Yes |  |
| processEvent | `(event: QueuedEvent<T>) => Promise<void>` | Yes |  |
| processListener | `(listener: BaseListener<T>, event: QueuedEvent<T>, listenerTimeout: number) => Promise<void>` | Yes |  |
| getLane | `(type: keyof ListenerEventRawData) => EventQueueLane` | Yes |  |
| maybeYield | `() => Promise<void>` | Yes |  |
| getMetrics | `() => void` | Yes |  |
| hasCapacity | `() => boolean` | Yes |  |
| getUtilization | `() => number` | Yes |  |
| getOldestAgeMs | `(lane: EventQueueLane) => void` | Yes |  |
