---
title: APILabelComponent2
hidden: true
---

## Signature

```ts
type APILabelComponent2 = Omit<APILabelComponent, "component"> & {
	component:
		| APIComponentInLabel
		| import("discord-api-types/v10").APICheckboxActionComponent
		| import("discord-api-types/v10").APICheckboxGroupActionComponent
		| import("discord-api-types/v10").APIRadioGroupActionComponent
	// god i hate inline imports but this is the best way to do this for now and be reliable
}
```

