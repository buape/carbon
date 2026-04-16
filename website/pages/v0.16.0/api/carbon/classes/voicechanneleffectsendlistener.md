---
title: VoiceChannelEffectSendListener
hidden: true
---

## class `VoiceChannelEffectSendListener`

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| type | `unknown` | Yes |  |
| handle | `(data: ListenerEventData[this["type"]], client: Client) => Promise<void>` | Yes |  |
| parseRawData | `(data: ListenerEventRawData[this["type"]], client: Client) => ListenerEventData[this["type"]]` | Yes |  |
