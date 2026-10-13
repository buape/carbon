---
title: RequestSchedulerOptions
hidden: true
---

## Signature

```ts
type RequestSchedulerOptions = {
	maxConcurrency?: number
	maxRateLimitRetries?: number
	lanes?: Partial<Record<RequestLane, RequestSchedulerLaneOptions>>
}
```


### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| maxConcurrency | `number` | No |  |
| maxRateLimitRetries | `number` | No |  |
| lanes | `Partial<Record<RequestLane, RequestSchedulerLaneOptions>>` | No |  |
