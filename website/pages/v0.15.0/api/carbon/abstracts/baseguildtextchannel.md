---
title: BaseGuildTextChannel
hidden: true
---

## class `BaseGuildTextChannel`

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| rawData | `APIGuildTextChannel<Type> | null` | Yes |  |
| getChannelPins | `(options: RESTGetAPIChannelMessagesPinsQuery) => void` | Yes | Get the pinned messages in the channel using paginated API @param options Optional pagination parameters |
| startThread | `(data: RESTPostAPIChannelThreadsJSONBody) => void` | Yes | Start a thread without an associated start message. If you want to start a thread with a start message, use {@link Message.startThread} |
