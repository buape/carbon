---
title: GatewayState
description: Represents the current state of the Gateway connection
hidden: true
---

## interface `GatewayState`

Represents the current state of the Gateway connection

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| sequence | `number | null` | Yes | Last sequence number received from Gateway - used for resuming connections |
| sessionId | `string | null` | Yes | Current session ID - used for resuming connections |
| resumeGatewayUrl | `string | null` | Yes | URL for resuming the Gateway connection if disconnected |
