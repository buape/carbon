---
title: BaseCommand
description: Represents the base data of a command that the user creates
hidden: true
---

## class `BaseCommand`

Represents the base data of a command that the user creates

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | `string` | No |  |
| name | `string` | Yes | The name of the command (e.g. "ping" for /ping) |
| description | `string` | No | A description of the command |
| nameLocalizations | `Record<string, string>` | No | The localized name of the command @see https://discord.com/developers/docs/interactions/application-commands#localization |
| descriptionLocalizations | `Record<string, string>` | No | The localized description of the command @see https://discord.com/developers/docs/interactions/application-commands#localization |
| defer | `boolean | ConditionalCommandOption` | Yes | Whether the command response should be automatically deferred. Can be a boolean or a function that receives the interaction and returns a boolean. |
| ephemeral | `boolean | ConditionalCommandOption` | Yes | Whether the command response should be ephemeral. Can be a boolean or a function that receives the interaction and returns a boolean. |
| type | `ApplicationCommandType` | Yes | The type of the command |
| integrationTypes | `ApplicationIntegrationType[]` | Yes | The places this command can be used in |
| contexts | `InteractionContextType[]` | Yes | The contexts this command can be used in |
| permission | `ArrayOrSingle<(typeof Permission)[keyof typeof Permission]>` | No | The default permission that a user needs to have to use this command. This can be overridden by server admins. |
| components | `BaseMessageInteractiveComponent[]` | No | The components that this command uses. These will be registered with the client when the command is initialized. |
| middlewares | `CommandMiddleware[]` | No | Middleware hooks that run around this command's lifecycle.  - `before` runs before `defer`, `preCheck`, and `run` - `after` runs in a `finally` block with status and timing metadata |
| guildIds | `string[]` | No | The guild IDs this command should be deployed to (guild-specific deployment). If not set, the command is deployed globally. |
| handler | `EntryPointCommandHandlerType` | No | The handler for an entry point command. Only used for command type `PrimaryEntryPoint`. |
| serialize | `() => void` | Yes | Serializes the command into a JSON object that can be sent to Discord @internal |
| serializeOptions | `() => RESTPostAPIApplicationCommandsJSONBody["options"]` | Yes | Serializes the options of the command into a JSON object that can be sent to Discord @internal |
| getMention | `(client: Client) => Promise<string>` | Yes |  |
| findMatchingCommand | `(commands: APIApplicationCommand[]) => void` | Yes |  |
