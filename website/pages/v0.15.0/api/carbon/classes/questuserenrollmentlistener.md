---
title: QuestUserEnrollmentListener
hidden: true
---

## class `QuestUserEnrollmentListener`

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| type | `unknown` | Yes |  |
| handle | `(data: ListenerEventData[this["type"]], client: Client) => Promise<void>` | Yes |  |
| parseRawData | `(data: ListenerEventRawData[this["type"]]) => ListenerEventData[this["type"]]` | Yes |  |
