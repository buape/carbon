---
title: RateLimitError
description: A RateLimitError is thrown when the bot is rate limited by Discord, and you don't have requests set to queue.
hidden: true
---

## class `RateLimitError`

A RateLimitError is thrown when the bot is rate limited by Discord, and you don't have requests set to queue.

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| retryAfter | `number` | Yes |  |
| scope | `"global" | "shared" | "user"` | Yes |  |
| bucket | `string | null` | Yes |  |
| request | `Request` | Yes |  |
| method | `string` | Yes |  |
| url | `string` | Yes |  |
