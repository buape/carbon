---
title: AutocompleteInteraction
hidden: true
---

## class `AutocompleteInteraction`

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| options | `AutocompleteOptionsHandler` | Yes | This is the options of the commands, parsed from the interaction data. |
| defer | `() => Promise<never>` | Yes |  |
| reply | `() => Promise<never>` | Yes |  |
| respond | `(choices: {
			/**
			 * The name of the choice, this is what the user will see
			 */
			name: string
			/**
			 * The value of the choice, this is what the bot will receive from Discord as the value
			 */
			value: string | number
		}[]) => void` | Yes | Respond with the choices for an autocomplete interaction |
