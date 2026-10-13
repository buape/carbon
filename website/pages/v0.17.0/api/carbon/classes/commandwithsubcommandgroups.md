---
title: CommandWithSubcommandGroups
description: Represents a subcommand group command that the user creates.
hidden: true
---

## class `CommandWithSubcommandGroups`

Represents a subcommand group command that the user creates.
You make this instead of a {@link Command} class when you want to have subcommand groups in your options.

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| subcommands | `Command[]` | Yes | The subcommands that the user can use |
| subcommandGroups | `CommandWithSubcommands[]` | Yes | The subcommands that the user can use |
| serializeOptions | `() => void` | Yes | @internal |
