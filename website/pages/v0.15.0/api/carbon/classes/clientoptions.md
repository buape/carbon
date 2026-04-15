---
title: ClientOptions
description: The options used for initializing the client
hidden: true
---

## interface `ClientOptions`

The options used for initializing the client

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| baseUrl | `string` | Yes | The base URL of the app |
| clientId | `string` | Yes | The client ID of the app |
| deploySecret | `string` | No | The deploy secret of the app, used for protecting the deploy route |
| publicKey | `string | string[]` | Yes | The public key of the app, used for interaction verification Can be a single key or an array of keys |
| token | `string` | Yes | The token of the bot |
| runtimeProfile | `RuntimeProfile` | No | Runtime profile for Carbon core scheduling defaults.  @default "serverless" |
| requestOptions | `RequestClientOptions` | No | The options used to initialize the request client, if you want to customize it. |
| autoDeploy | `boolean` | No | Whether the commands should be deployed to Discord automatically. @default false |
| commandDeploymentMode | `"overwrite" | "reconcile"` | No | The strategy to use when deploying global commands. Guild and dev-guild deployments always use Discord's bulk overwrite route.  @default "overwrite" |
| disableDeployRoute | `boolean` | No | Whether the deploy route should be disabled. @default false |
| disableInteractionsRoute | `boolean` | No | Whether the interactions route should be disabled @default false |
| disableEventsRoute | `boolean` | No | Whether the events route should be disabled @default false |
| devGuilds | `string[]` | No | A list of guild IDs to deploy all commands to during development (guild command deployment is instant and rate-limited higher). If set, all commands will be deployed to these guilds instead of globally. |
| eventQueue | `EventQueueOptions` | No | Configuration for the event queue worker pool |
| commandMiddlewares | `CommandMiddleware[]` | No | Middleware hooks that run around every command execution.  These run before per-command middlewares. |
