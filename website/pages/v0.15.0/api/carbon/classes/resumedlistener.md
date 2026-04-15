---
title: ResumedListener
hidden: true
---

## class `ResumedListener`

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| type | `unknown` | Yes |  |
| handle | `(data: ListenerEventData[this["type"]], client: Client) => Promise<void>` | Yes |  |
| parseRawData | `(data: ListenerEventRawData[this["type"]]) => ListenerEventData[this["type"]]` | Yes |  |
