---
title: CloudflareGatewayForwardPayload
hidden: true
---

## Signature

```ts
type CloudflareGatewayForwardPayload = {
	type: ListenerEventType
	data: ListenerEventRawData[ListenerEventType]
}
```


### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| type | `ListenerEventType` | Yes |  |
| data | `ListenerEventRawData[ListenerEventType]` | Yes |  |
