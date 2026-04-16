---
title: RequestScheduler
hidden: true
---

## class `RequestScheduler`

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| pendingByRoute | `unknown` | Yes |  |
| laneCounts | `unknown` | Yes |  |
| laneDropped | `unknown` | Yes |  |
| laneSchedule | `RequestLane[]` | Yes |  |
| laneCursor | `unknown` | Yes |  |
| routeCursorByLane | `unknown` | Yes |  |
| laneConfig | `Record<
		RequestLane,
		{
			weight: number
			maxQueueSize: number
			staleAfterMs?: number
		}
	>` | Yes |  |
| enqueue | `(request: T) => void` | Yes |  |
| takeNext | `(options: {
		isRouteReady(routeKey: string): number
		isBucketActive(routeKey: string): boolean
	}) => { request: T | null; waitMs: number | null }` | Yes |  |
| clear | `(reason: unknown) => void` | Yes |  |
| getMetrics | `() => void` | Yes |  |
| compactRoute | `(routeKey: string, routeQueues: {
			critical: T[]
			standard: T[]
			background: T[]
		}) => void` | Yes |  |
| isStale | `(request: T | undefined, now: unknown) => void` | Yes |  |
| getOldestAgeForLane | `(lane: RequestLane) => void` | Yes |  |
