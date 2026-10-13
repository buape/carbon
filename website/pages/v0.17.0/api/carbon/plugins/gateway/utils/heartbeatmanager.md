---
title: HeartbeatManager
hidden: true
---

## interface `HeartbeatManager`

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| sequence | `number | null` | Yes |  |
| lastHeartbeatAck | `boolean` | Yes |  |
| heartbeatInterval | `NodeJS.Timeout` | No |  |
| firstHeartbeatTimeout | `NodeJS.Timeout` | No |  |
| send | `(payload: {
		op: (typeof GatewayOpcodes)[keyof typeof GatewayOpcodes]
		d: number | null
	}) => void` | Yes |  |
