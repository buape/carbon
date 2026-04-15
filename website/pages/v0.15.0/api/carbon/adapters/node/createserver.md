---
title: createServer
description: Creates a server for the client or client manager using Hono.serve under the hood
hidden: true
---

## `createServer(client: Client | ClientManager, options: ServerOptions): Server`

Creates a server for the client or client manager using Hono.serve under the hood

### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| client | `Client | ClientManager` | Yes | The Carbon client or client manager to create the server for |
| options | `ServerOptions` | Yes | Additional options for the server |

### Returns

`Server`
