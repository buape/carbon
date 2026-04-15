---
title: OptionsHandler
description: This class is used to parse the options of a command, and provide errors for any missing or invalid options.
hidden: true
---

## class `OptionsHandler`

This class is used to parse the options of a command, and provide errors for any missing or invalid options.
It is used internally by the Command class.

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| raw | `APIApplicationCommandInteractionDataBasicOption[]` | Yes | The raw options that were in the interaction data, before they were parsed. |
| resolved | `Partial<APIInteractionDataResolved>` | Yes | The resolved data from the interaction. |
| guildId | `string` | No |  |
| interactionData | `| APIChatInputApplicationCommandInteractionData
		| APIAutocompleteApplicationCommandInteractionData` | No |  |
| definitions | `CommandOptions` | No |  |
| getString | `(key: string, required: false) => string | undefined` | Yes | Get the value of a string option. @param key The name of the option to get the value of. @param required Whether the option is required. @returns The value of the option, or undefined if the option was not provided and it is not required. |
| getString | `(key: string, required: true) => string` | Yes |  |
| getString | `(key: string, required: unknown) => string | undefined` | Yes |  |
| getInteger | `(key: string, required: false) => number | undefined` | Yes | Get the value of an integer option. @param key The name of the option to get the value of. @param required Whether the option is required. @returns The value of the option, or undefined if the option was not provided and it is not required. |
| getInteger | `(key: string, required: true) => number` | Yes |  |
| getInteger | `(key: string, required: unknown) => number | undefined` | Yes |  |
| getNumber | `(key: string, required: false) => number | undefined` | Yes | Get the value of a number option. @param key The name of the option to get the value of. @param required Whether the option is required. @returns The value of the option, or undefined if the option was not provided and it is not required. |
| getNumber | `(key: string, required: true) => number` | Yes |  |
| getNumber | `(key: string, required: unknown) => number | undefined` | Yes |  |
| getBoolean | `(key: string, required: false) => boolean | undefined` | Yes | Get the value of a boolean option. @param key The name of the option to get the value of. @param required Whether the option is required. @returns The value of the option, or undefined if the option was not provided and it is not required. |
| getBoolean | `(key: string, required: true) => boolean` | Yes |  |
| getBoolean | `(key: string, required: unknown) => boolean | undefined` | Yes |  |
| getUser | `(key: string, required: false) => User | undefined` | Yes | Get the value of a user option. @param key The name of the option to get the value of. @param required Whether the option is required. @returns The value of the option, or undefined if the option was not provided and it is not required. |
| getUser | `(key: string, required: true) => User` | Yes |  |
| getUser | `(key: string, required: unknown) => User | undefined` | Yes |  |
| getMember | `(key: string, required: false) => GuildMember<false, true> | null | undefined` | Yes | Get the member data of the value of a user option, if the user is in the guild the interaction was ran in. @param key The name of the option to get the value of. @param required Whether the option is required. @returns The value of the option, or undefined if the option was not provided and it is not required, or null if the user is not in the server. |
| getMember | `(key: string, required: true) => GuildMember<false, true> | null` | Yes |  |
| getMember | `(key: string, required: unknown) => GuildMember<false, true> | null | undefined` | Yes |  |
| getChannelId | `(key: string, required: false) => Promise<string | undefined>` | Yes |  |
| getChannelId | `(key: string, required: true) => Promise<string>` | Yes |  |
| getChannelId | `(key: string, required: unknown) => void` | Yes |  |
| getChannel | `(key: string, required: false) => Promise<AnyChannel | undefined>` | Yes | Get the value of a channel option. @param key The name of the option to get the value of. @param required Whether the option is required. @returns The ID of the selected channel, or undefined if the option was not provided and it is not required. |
| getChannel | `(key: string, required: true) => Promise<AnyChannel>` | Yes |  |
| getChannel | `(key: string, required: unknown) => Promise<AnyChannel | undefined>` | Yes |  |
| getRole | `(key: string, required: false) => Role | undefined` | Yes | Get the value of a role option. @param key The name of the option to get the value of. @param required Whether the option is required. @returns The value of the option, or undefined if the option was not provided and it is not required. |
| getRole | `(key: string, required: true) => Role` | Yes |  |
| getRole | `(key: string, required: unknown) => Role | undefined` | Yes |  |
| getMentionable | `(key: string, required: false) => User | Role | undefined` | Yes | Get the value of a mentionable option. @param key The name of the option to get the value of. @param required Whether the option is required. @returns The value of the option, or undefined if the option was not provided and it is not required. |
| getMentionable | `(key: string, required: true) => User | Role` | Yes |  |
| getMentionable | `(key: string, required: unknown) => User | Role | undefined` | Yes |  |
| getAttachment | `(key: string, required: false) => ResolvedFile | undefined` | Yes |  |
| getAttachment | `(key: string, required: true) => ResolvedFile` | Yes |  |
| getAttachment | `(key: string, required: unknown) => ResolvedFile | undefined` | Yes |  |
| checkAgainstDefinition | `(key: string, value: string | number | boolean) => void` | Yes |  |
