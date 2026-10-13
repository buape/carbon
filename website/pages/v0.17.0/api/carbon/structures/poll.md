---
title: Poll
hidden: true
---

## class `Poll`

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| channelId | `ChannelId` | Yes |  |
| messageId | `MessageId` | Yes |  |
| _rawData | `APIPoll` | Yes |  |
| getAnswerVoters | `(answerId: number) => Promise<User[]>` | Yes |  |
| end | `() => Promise<Message<false>>` | Yes |  |
