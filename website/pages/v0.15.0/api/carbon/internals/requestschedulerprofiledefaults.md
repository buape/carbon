---
title: requestSchedulerProfileDefaults
hidden: true
---

## Signature

```ts
const requestSchedulerProfileDefaults: {
	serverless: {
		maxConcurrency: 3,
		maxRateLimitRetries: 2,
		lanes: {
			critical: { weight: 7, maxQueueSize: 2000 },
			standard: { weight: 2, maxQueueSize: 1500, staleAfterMs: 20_000 },
			background: { weight: 1, maxQueueSize: 600, staleAfterMs: 7_500 }
		}
	},
	persistent: {
		maxConcurrency: 8,
		maxRateLimitRetries: 3,
		lanes: {
			critical: { weight: 6, maxQueueSize: 6000 },
			standard: { weight: 3, maxQueueSize: 10_000, staleAfterMs: 60_000 },
			background: { weight: 1, maxQueueSize: 5_000, staleAfterMs: 20_000 }
		}
	}
} satisfies Record<
	RuntimeProfile,
	{
		maxConcurrency: number
		maxRateLimitRetries: number
		lanes: Record<
			RequestLane,
			{
				weight: number
				maxQueueSize: number
				staleAfterMs?: number
			}
		>
	}
>
```

