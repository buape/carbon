---
title: CommandWithSubcommands
description: Represents a subcommand command that the user creates.
hidden: true
---

## class `CommandWithSubcommands`

Represents a subcommand command that the user creates.
You make this instead of a {@link Command} class when you want to have subcommands in your options.

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| type | `unknown` | Yes |  |
| subcommands | `Command[]` | Yes | The subcommands that the user can use |
| serializeOptions | `() => RESTPostAPIApplicationCommandsJSONBody["options"]` | Yes | @internal |
