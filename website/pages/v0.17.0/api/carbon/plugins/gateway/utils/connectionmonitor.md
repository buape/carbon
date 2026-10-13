---
title: ConnectionMonitor
hidden: true
---

## class `ConnectionMonitor`

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| metrics | `ConnectionMetrics` | Yes |  |
| startTime | `unknown` | Yes |  |
| lastHeartbeat | `unknown` | Yes |  |
| metricsInterval | `NodeJS.Timeout` | Yes |  |
| config | `Required<MonitorConfig>` | Yes |  |
| createMetricsInterval | `() => NodeJS.Timeout` | Yes |  |
| recordError | `() => void` | Yes |  |
| recordZombieConnection | `() => void` | Yes |  |
| recordHeartbeat | `() => void` | Yes |  |
| recordHeartbeatAck | `() => void` | Yes |  |
| recordReconnect | `() => void` | Yes |  |
| recordMessageReceived | `() => void` | Yes |  |
| recordMessageSent | `() => void` | Yes |  |
| resetUptime | `() => void` | Yes |  |
| getMetrics | `() => ConnectionMetrics` | Yes |  |
| reset | `() => void` | Yes |  |
| destroy | `() => void` | Yes |  |
