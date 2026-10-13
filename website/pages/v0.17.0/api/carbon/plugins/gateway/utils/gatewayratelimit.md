---
title: GatewayRateLimit
hidden: true
---

## class `GatewayRateLimit`

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| events | `number[]` | Yes |  |
| config | `RateLimitConfig` | Yes |  |
| canSend | `() => boolean` | Yes | Check if sending an event would exceed the rate limit @returns true if the event can be sent, false if rate limited |
| recordEvent | `() => void` | Yes | Record that an event was sent |
| getCurrentEventCount | `() => number` | Yes | Get the current number of events in the time window |
| getRemainingEvents | `() => number` | Yes | Get remaining events before hitting rate limit |
| getResetTime | `() => number` | Yes | Get time until rate limit resets (in milliseconds) |
| cleanupOldEvents | `() => void` | Yes | Remove events outside the current time window |
| reset | `() => void` | Yes | Reset the rate limiter |
