---
title: ClientManagerStartupOptions
hidden: true
---

## interface `ClientManagerStartupOptions`

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| concurrency | `number` | No | Maximum number of clients initialized in parallel during startup. |
| failFast | `boolean` | No | If true, startup stops scheduling new clients after first failure. |
