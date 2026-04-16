---
title: DiscordError
hidden: true
---

## class `DiscordError`

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| status | `number` | Yes | The HTTP status code of the response from Discord @see https://discord.com/developers/docs/topics/opcodes-and-status-codes#http |
| discordCode | `number` | No | The Discord error code @see https://discord.com/developers/docs/topics/opcodes-and-status-codes#json |
| errors | `TransformedError[]` | Yes | An array of the errors that were returned by Discord |
| rawBody | `DiscordRawError` | Yes | The raw body of the error from Discord @internal |
