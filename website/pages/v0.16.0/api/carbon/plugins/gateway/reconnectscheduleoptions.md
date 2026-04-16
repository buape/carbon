---
title: ReconnectScheduleOptions
hidden: true
---

## interface `ReconnectScheduleOptions`

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| code | `number` | No |  |
| reason | `"close" | "invalid-session" | "zombie" | "reconnect-opcode"` | Yes |  |
| preferResume | `boolean` | Yes |  |
| minDelayMs | `number` | No |  |
| allowImmediateFirstAttempt | `boolean` | No |  |
