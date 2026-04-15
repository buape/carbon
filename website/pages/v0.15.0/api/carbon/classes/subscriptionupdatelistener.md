---
title: SubscriptionUpdateListener
hidden: true
---

## class `SubscriptionUpdateListener`

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| type | `unknown` | Yes |  |
| handle | `(data: ListenerEventData[this["type"]], client: Client) => Promise<void>` | Yes |  |
| parseRawData | `(data: ListenerEventRawData[this["type"]], client: Client) => ListenerEventData[this["type"]]` | Yes |  |
