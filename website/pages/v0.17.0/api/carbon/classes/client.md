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
| instrumentation | `unknown` | Yes | Runtime-neutral instrumentation for Carbon operations and events. |
| options | `ClientOptions` | Yes | The options used to initialize the client |
| clientId | `ApplicationId` | Yes | The resolved client ID for this application. |
| publicKey | `LegacyPublicKey | string[]` | No | The resolved public key configuration for this application. |
| commands | `BaseCommand[]` | Yes | The commands that the client has registered |
| commandMiddlewares | `CommandMiddleware[]` | Yes | Registered global middleware hooks for command execution. |
| listeners | `AnyListener[]` | Yes | The event listeners that the client has registered |
| rest | `RequestClient` | Yes | The rest client used to interact with the Discord API |
| ready | `Promise<void>` | Yes | Resolves once Carbon has fetched any boot-time application metadata. |
| cache | `CacheManager` | Yes | Opt-in entity cache manager. |
| logger | `Logger` | Yes | Logger used by Carbon internals. |
| componentHandler | `ComponentHandler` | Yes | The handler for the component interactions sent from Discord @internal |
| commandHandler | `CommandHandler` | Yes | The handler for the modal interactions sent from Discord @internal |
| modalHandler | `ModalHandler` | Yes | The handler for the modal interactions sent from Discord @internal |
| eventHandler | `EventHandler` | Yes | The handler for events sent from Discord @internal |
| temporaryListeners | `TemporaryListenerManager` | Yes | The manager for temporary event listeners with automatic cleanup |
| emoji | `EmojiHandler` | Yes | The handler for application emojis for this application |
| cachedGlobalCommands | `BrandedAPIApplicationCommand[] | null` | Yes |  |
| shardId | `number` | No | The ID of the shard this client is running on, if sharding is enabled |
| totalShards | `number` | No | The total number of shards, if sharding is enabled |
| initializeApplication | `() => void` | Yes |  |
| getPlugin | `(id: string) => T | undefined` | Yes |  |
| setCache | `(cache: CacheManager) => void` | Yes |  |
| useTestHooks | `(hooks: CarbonTestHooks) => CarbonTestHookDisposer` | Yes |  |
| useDiscordFetch | `(fetch: CarbonFetch) => CarbonTestHookDisposer` | Yes |  |
| getRuntimeMetrics | `() => void` | Yes |  |
| appendRoutes | `() => void` | Yes |  |
| handleDeployRequest | `(req: Request) => void` | Yes | Handle a request to deploy the commands to Discord @returns A response |
| deployCommands | `(options: { mode?: "overwrite" | "reconcile" }) => void` | Yes |  |
| reconcileCommands | `() => void` | Yes |  |
| handleEventsRequest | `(req: Request) => void` | Yes | Handle an interaction request from Discord @param req The request to handle @returns A response |
| handleEventsRequestInternal | `(req: Request) => void` | Yes |  |
| handleInteractionsRequest | `(req: Request, ctx: Context) => void` | Yes | Handle an interaction request from Discord @param req The request to handle @param ctx The context for the request @returns A response |
| handleInteractionsRequestInternal | `(req: Request, ctx: Context) => void` | Yes |  |
| handleInteraction | `(interaction: APIInteraction, ctx: Context) => void` | Yes | Handle an interaction request from Discord @param interaction The interaction to handle @param ctx The context for the request @returns A response |
| validateDiscordRequest | `(req: Request) => void` | Yes | Validate a request from Discord @param req The request to validate |
| registerListener | `(listener: T) => void` | Yes | Register an event listener with the client. This method provides type-safe listener registration without requiring manual type casting at the call site. @param listener The listener to register |
| fetchUser | `(id: UserIdLike, force: boolean) => void` | Yes | Fetch a user from the Discord API @param id The ID of the user to fetch @param force Whether to bypass cache and request fresh data from Discord @returns The user data |
| fetchGuild | `(id: GuildIdLike, force: boolean) => void` | Yes | Fetch a guild from the Discord API @param id The ID of the guild to fetch @param force Whether to bypass cache and request fresh data from Discord @returns The guild data |
| fetchChannel | `(id: ChannelIdLike, force: boolean) => void` | Yes | Fetch a channel from the Discord API @param id The ID of the channel to fetch @param force Whether to bypass cache and request fresh data from Discord @returns The channel data |
| fetchRole | `(guildId: GuildIdLike, id: RoleIdLike, force: boolean) => void` | Yes | Fetch a role from the Discord API @param guildId The ID of the guild the role is in @param id The ID of the role to fetch @param force Whether to bypass cache and request fresh data from Discord @returns The role data |
| fetchMember | `(guildId: GuildIdLike, id: UserIdLike, force: boolean) => void` | Yes | Fetch a member from the Discord API @param guildId The ID of the guild the member is in @param id The ID of the member to fetch @param force Whether to bypass cache and request fresh data from Discord @returns The member data |
| fetchMessage | `(channelId: ChannelIdLike, messageId: MessageIdLike, force: boolean) => void` | Yes | Fetch a message from the Discord API @param channelId The ID of the channel the message is in @param messageId The ID of the message to fetch @param force Whether to bypass cache and request fresh data from Discord @returns The message data |
| fetchWebhook | `(input: WebhookInput) => void` | Yes | Fetch a webhook from the Discord API @param input The webhook data, ID and token, or webhook URL @returns The webhook data |
| getDiscordCommands | `(force: unknown) => void` | Yes |  |
| updateCommandIdsFromDeployment | `(commands: APIApplicationCommand[]) => void` | Yes |  |
| reconcileGlobalCommands | `(commands: BaseCommand[]) => void` | Yes |  |
