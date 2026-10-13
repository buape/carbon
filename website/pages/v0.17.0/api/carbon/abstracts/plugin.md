---
title: Plugin
description: The base class for all plugins
hidden: true
---

## class `Plugin`

The base class for all plugins

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | `string` | Yes | An ID that identifies the plugin uniquely between all other used plugins in the Client |
| registerClient | `(client: Client) => Promise<void> | void` | Yes | Registers the client with this plugin @param client The client to register |
| registerRoutes | `(client: Client) => Promise<void> | void` | Yes | Registers the routes of this plugin with the client @param client The client to register the routes with |
| onRequest | `(req: Request, ctx: Context) => Promise<Response | undefined> | Response | undefined` | Yes | Optional per-request hook for runtime-specific middleware behavior. Return a Response to short-circuit normal route handling. |
