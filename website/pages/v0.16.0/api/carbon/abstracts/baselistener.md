---
title: BaseListener
description: Base class for creating event listeners that handle Discord gateway events.
hidden: true
---

## class `BaseListener`

Base class for creating event listeners that handle Discord gateway events.
This abstract class defines the structure for event listeners and provides type safety for event handling.

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| type | `TEvent` | Yes |  |
| handle | `(data: ListenerEventData[TEvent] & ListenerEventAdditionalData, client: Client) => Promise<void>` | Yes |  |
| parseRawData | `(data: ListenerEventRawData[TEvent] & ListenerEventAdditionalData, client: Client) => ListenerEventData[TEvent]` | Yes |  |
