---
title: Client
description: The main client used to interact with Discord
hidden: true
---

## class `Client`

The main client used to interact with Discord

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| routes | `Route[]` | Yes | The routes that the client will handle |
| plugins | `{ id: string; plugin: Plugin }[]` | Yes | The plugins that the client has registered |
| options | `ClientOptions` | Yes | The options used to initialize the client |
| commands | `BaseCommand[]` | Yes | The commands that the client has registered |
| commandMiddlewares | `CommandMiddleware[]` | Yes | Registered global middleware hooks for command execution. |
| listeners | `AnyListener[]` | Yes | The event listeners that the client has registered |
| rest | `RequestClient` | Yes | The rest client used to interact with the Discord API |
| componentHandler | `ComponentHandler` | Yes | The handler for the component interactions sent from Discord @internal |
| commandHandler | `CommandHandler` | Yes | The handler for the modal interactions sent from Discord @internal |
| modalHandler | `ModalHandler` | Yes | The handler for the modal interactions sent from Discord @internal |
| eventHandler | `EventHandler` | Yes | The handler for events sent from Discord @internal |
| temporaryListeners | `TemporaryListenerManager` | Yes | The manager for temporary event listeners with automatic cleanup |
| emoji | `EmojiHandler` | Yes | The handler for application emojis for this application |
| cachedGlobalCommands | `APIApplicationCommand[] | null` | Yes |  |
| shardId | `number` | No | The ID of the shard this client is running on, if sharding is enabled |
| totalShards | `number` | No | The total number of shards, if sharding is enabled |
| getPlugin | `(id: string) => T | undefined` | Yes |  |
| getRuntimeMetrics | `() => void` | Yes |  |
| appendRoutes | `() => void` | Yes |  |
| handleDeployRequest | `(req: Request) => void` | Yes | Handle a request to deploy the commands to Discord @returns A response |
| deployCommands | `(options: { mode?: "overwrite" | "reconcile" }) => void` | Yes |  |
| reconcileCommands | `() => void` | Yes |  |
| handleEventsRequest | `(req: Request) => void` | Yes | Handle an interaction request from Discord @param req The request to handle @returns A response |
| handleInteractionsRequest | `(req: Request, ctx: Context) => void` | Yes | Handle an interaction request from Discord @param req The request to handle @param ctx The context for the request @returns A response |
| handleInteraction | `(interaction: APIInteraction, ctx: Context) => void` | Yes | Handle an interaction request from Discord @param interaction The interaction to handle @param ctx The context for the request @returns A response |
| validateDiscordRequest | `(req: Request) => void` | Yes | Validate a request from Discord @param req The request to validate |
| registerListener | `(listener: T) => void` | Yes | Register an event listener with the client. This method provides type-safe listener registration without requiring manual type casting at the call site. @param listener The listener to register |
| fetchUser | `(id: string) => void` | Yes | Fetch a user from the Discord API @param id The ID of the user to fetch @returns The user data |
| fetchGuild | `(id: string) => void` | Yes | Fetch a guild from the Discord API @param id The ID of the guild to fetch @returns The guild data |
| fetchChannel | `(id: string) => void` | Yes | Fetch a channel from the Discord API @param id The ID of the channel to fetch @returns The channel data |
| fetchRole | `(guildId: string, id: string) => void` | Yes | Fetch a role from the Discord API @param guildId The ID of the guild the role is in @param id The ID of the role to fetch @returns The role data |
| fetchMember | `(guildId: string, id: string) => void` | Yes | Fetch a member from the Discord API @param guildId The ID of the guild the member is in @param id The ID of the member to fetch @returns The member data |
| fetchMessage | `(channelId: string, messageId: string) => void` | Yes | Fetch a message from the Discord API @param channelId The ID of the channel the message is in @param messageId The ID of the message to fetch @returns The message data |
| fetchWebhook | `(input: WebhookInput) => void` | Yes | Fetch a webhook from the Discord API @param input The webhook data, ID and token, or webhook URL @returns The webhook data |
| getDiscordCommands | `(force: unknown) => void` | Yes |  |
| updateCommandIdsFromDeployment | `(commands: APIApplicationCommand[]) => void` | Yes |  |
| reconcileGlobalCommands | `(commands: BaseCommand[]) => void` | Yes |  |
