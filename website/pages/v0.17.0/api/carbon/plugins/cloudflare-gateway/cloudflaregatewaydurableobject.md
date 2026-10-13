---
title: CloudflareGatewayDurableObject
hidden: true
---

## class `CloudflareGatewayDurableObject`

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| state | `{
		storage: {
			get<T>(key: string): Promise<T | undefined>
			put(key: string, value: unknown): Promise<void>
			delete(key: string): Promise<boolean | number | undefined>
			setAlarm(time: number | Date): Promise<void>
			deleteAlarm?(): Promise<void>
		}
	}` | Yes |  |
| config | `CloudflareGatewayDurableObjectConfig | null` | Yes |  |
| gateway | `GatewayPlugin | null` | Yes |  |
| bootstrap | `Promise<void>` | Yes |  |
| connecting | `Promise<void> | null` | Yes |  |
| fetch | `(request: Request) => void` | Yes |  |
| alarm | `() => void` | Yes |  |
| restore | `() => void` | Yes |  |
| ensureConnected | `() => void` | Yes |  |
| scheduleReconnectAlarm | `() => void` | Yes |  |
| createClientBridge | `(config: CloudflareGatewayDurableObjectConfig) => void` | Yes |  |
| forwardEvent | `(config: CloudflareGatewayDurableObjectConfig, type: CloudflareGatewayForwardPayload["type"], data: CloudflareGatewayForwardPayload["data"]) => void` | Yes |  |
