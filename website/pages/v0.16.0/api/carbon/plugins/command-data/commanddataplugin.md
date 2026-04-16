---
title: CommandDataPlugin
description: This plugin is a basic plugin that allows you to get the command data from the client over HTTP.
hidden: true
---

## class `CommandDataPlugin`

This plugin is a basic plugin that allows you to get the command data from the client over HTTP.
The JSON array provided here is the same as the one you would send to Discord, allowing you to build your own command deployment setup.

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | `unknown` | Yes |  |
| client | `Client` | No |  |
| registerClient | `(client: Client) => void` | Yes |  |
| registerRoutes | `(client: Client) => void` | Yes |  |
| discordCommandData | `APIApplicationCommand[] | null` | Yes |  |
| handleFullCommandDataRequest | `() => void` | Yes |  |
| handleCommandDataRequest | `() => void` | Yes |  |
