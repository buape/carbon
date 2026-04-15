---
title: FieldsHandler
description: This class is used to parse the fields of a modal submit interaction.
hidden: true
---

## class `FieldsHandler`

This class is used to parse the fields of a modal submit interaction.
It is used internally by the Modal class.

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| rawData | `{ [key: string]: string[] }` | Yes | The raw data from the interaction. |
| resolved | `APIInteractionDataResolved` | Yes | The resolved data from the interaction. |
| guildId | `string` | No |  |
| getText | `(key: string, required: false) => string | undefined` | Yes | Get the value of a text input or text display. @param key The custom ID of the input or display to get the value of. @returns The value of the input or display, or undefined if the input or display was not provided. |
| getText | `(key: string, required: true) => string` | Yes |  |
| getText | `(key: string, required: unknown) => void` | Yes |  |
| getStringSelect | `(key: string, required: false) => string[] | undefined` | Yes | Get the value of a string select. @param key The custom ID of the select to get the value of. @param required Whether the select is required. @returns The value of the select menu, or undefined if the select menu was not provided and it is not required. |
| getStringSelect | `(key: string, required: true) => string[]` | Yes |  |
| getStringSelect | `(key: string, required: unknown) => void` | Yes |  |
| getChannelSelectIds | `(key: string, required: false) => string[] | undefined` | Yes |  |
| getChannelSelectIds | `(key: string, required: true) => string[]` | Yes |  |
| getChannelSelectIds | `(key: string, required: unknown) => void` | Yes |  |
| getChannelSelect | `(key: string, required: false) => Promise<AnyChannel[] | undefined>` | Yes | Get the channels selected in a channel select. This is async because Discord provides very limited information about the channels so we have to fetch it. You can use {@link FieldsHandler.getChannelSelectIds} to get the IDs of the selected channels, and that will not be async. @param key The custom ID of the channel select menu to get the value of. @param required Whether the channel select menu is required. @returns The IDs of the selected channels, or undefined if the select menu was not provided and it is not required. |
| getChannelSelect | `(key: string, required: true) => Promise<AnyChannel[]>` | Yes |  |
| getChannelSelect | `(key: string, required: unknown) => void` | Yes |  |
| getUserSelect | `(key: string, required: false) => User[] | undefined` | Yes | Get the users selected in a user select. @param key The custom ID of the user select menu to get the value of. @param required Whether the user select menu is required. @returns The IDs of the selected users, or undefined if the select menu was not provided and it is not required. |
| getUserSelect | `(key: string, required: true) => User[]` | Yes |  |
| getUserSelect | `(key: string, required: unknown) => User[] | undefined` | Yes |  |
| getRoleSelect | `(key: string, required: false) => Role[] | undefined` | Yes |  |
| getRoleSelect | `(key: string, required: true) => Role[]` | Yes |  |
| getRoleSelect | `(key: string, required: unknown) => void` | Yes |  |
| getMentionableSelect | `(key: string, required: false) => { users: User[]; roles: Role[] } | undefined` | Yes |  |
| getMentionableSelect | `(key: string, required: true) => { users: User[]; roles: Role[] }` | Yes |  |
| getMentionableSelect | `(key: string, required: unknown) => void` | Yes |  |
| getFile | `(key: string, required: false) => ResolvedFile[] | undefined` | Yes |  |
| getFile | `(key: string, required: true) => ResolvedFile[]` | Yes |  |
| getFile | `(key: string, required: unknown) => void` | Yes |  |
