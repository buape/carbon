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
| clientId | `ApplicationIdLike` | No | The client ID of the app. @deprecated Will be removed in the next major version. |
| deploySecret | `string` | No | The deploy secret of the app, used for protecting the deploy route |
| publicKey | `LegacyPublicKey | string[]` | No | Public key configuration used for interaction verification. Omit this to let Carbon fetch the app public key on boot. Passing an array supports additional public keys, such as forwarders. |
| token | `string` | Yes | The token of the bot |
| runtimeProfile | `RuntimeProfile` | No | Runtime profile for Carbon core scheduling defaults.  @default "serverless" |
| requestOptions | `RequestClientOptions` | No | The options used to initialize the request client, if you want to customize it. |
| autoDeploy | `boolean` | No | Whether the commands should be deployed to Discord automatically. @default false |
| commandDeploymentMode | `"overwrite" | "reconcile"` | No | The strategy to use when deploying global commands. Guild and dev-guild deployments always use Discord's bulk overwrite route.  @default "overwrite" |
| disableDeployRoute | `boolean` | No | Whether the deploy route should be disabled. @default false |
| disableInteractionsRoute | `boolean` | No | Whether the interactions route should be disabled @default false |
| disableEventsRoute | `boolean` | No | Whether the events route should be disabled @default false |
| devGuilds | `GuildIdLike[]` | No | A list of guild IDs to deploy all commands to during development (guild command deployment is instant and rate-limited higher). If set, all commands will be deployed to these guilds instead of globally. |
| eventQueue | `EventQueueOptions` | No | Configuration for the event queue worker pool |
| commandMiddlewares | `CommandMiddleware[]` | No | Middleware hooks that run around every command execution.  These run before per-command middlewares. |
| logger | `LoggerOptions` | No | Logger used by Carbon internals. Defaults to `console`; pass your own logger to redirect or silence logs. |
| testHooks | `CarbonTestHooks` | No | Hooks used by Carbon testing utilities to observe handler behavior. |
