---
title: CommandOption
hidden: true
---

## Signature

```ts
type CommandOption = | APIApplicationCommandBasicOption
	| (Omit<APIApplicationCommandBasicOption, "autocomplete"> & {
			autocomplete: (interaction: AutocompleteInteraction) => Promise<void>
	  })
```

