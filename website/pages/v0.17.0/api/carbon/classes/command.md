---
title: Command
description: Represents a standard command that the user creates
hidden: true
---

## class `Command`

Represents a standard command that the user creates

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| options | `CommandOptions` | No | The options that the user passes along with the command in Discord |
| type | `ApplicationCommandType` | Yes | The type of command, either ChatInput, User, or Message. User and Message are context menu commands. @default ChatInput |
| run | `(interaction: CommandInteraction) => unknown | Promise<unknown>` | Yes | The function that is called when the command is ran @param interaction The interaction that triggered the command |
| autocomplete | `(interaction: AutocompleteInteraction) => Promise<void>` | Yes | The function that is called when the command's autocomplete is triggered. @param interaction The interaction that triggered the autocomplete @remarks You are expected to `override` this function to provide your own autocomplete functionality. |
| preCheck | `(interaction: CommandInteraction) => Promise<true | unknown>` | Yes | The function that is called before the command is ran. You can use this to run things such as cooldown checks, extra permission checks, etc. If this returns anything other than `true`, the command will not run. @param interaction The interaction that triggered the command @returns Whether the command should continue to run |
| serializeOptions | `() => void` | Yes | @internal |
