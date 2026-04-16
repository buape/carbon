---
title: ApplicationCredentials
description: Credentials for a single application in the ClientManager
hidden: true
---

## interface `ApplicationCredentials`

Credentials for a single application in the ClientManager

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| clientId | `string` | Yes | The client ID of the application - must be a valid Discord snowflake |
| publicKey | `string | string[]` | Yes | The public key of the app, used for interaction verification Can be a single key or an array of keys |
| token | `string` | Yes | The token of the bot |
