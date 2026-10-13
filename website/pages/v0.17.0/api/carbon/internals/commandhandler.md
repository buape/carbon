---
title: CommandHandler
hidden: true
---

## class `CommandHandler`

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| getSubcommand | `(command: CommandWithSubcommands, rawInteraction: | APIApplicationCommandAutocompleteInteraction
			| APIApplicationCommandInteraction) => Command` | Yes |  |
| getCommand | `(rawInteraction: | APIApplicationCommandAutocompleteInteraction
			| APIApplicationCommandInteraction) => Command` | Yes |  |
| handleCommandInteraction | `(rawInteraction: APIApplicationCommandInteraction) => void` | Yes | Handle a command interaction @internal |
| handleCommandInteractionInternal | `(rawInteraction: APIApplicationCommandInteraction) => void` | Yes |  |
| handleAutocompleteInteraction | `(rawInteraction: APIApplicationCommandAutocompleteInteraction) => void` | Yes |  |
| handleAutocompleteInteractionInternal | `(rawInteraction: APIApplicationCommandAutocompleteInteraction) => void` | Yes |  |
