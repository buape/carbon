---
title: AnySelectMenu
hidden: true
---

## class `AnySelectMenu`

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| type | `AnySelectMenuComponentType` | Yes |  |
| run | `(interaction: AnySelectMenuInteraction, data: ComponentData) => unknown | Promise<unknown>` | Yes |  |
| minValues | `number` | No |  |
| maxValues | `number` | No |  |
| disabled | `boolean` | No | Not available in modals, will throw an error if used |
| placeholder | `string` | No |  |
| required | `boolean` | No | Defaults to true in modals, ignored in messages |
| serialize | `unknown` | Yes |  |
| serializeOptions | `() => | {
				type: ComponentType.ChannelSelect
				channel_types: APIChannelSelectComponent["channel_types"]
				default_values: APIChannelSelectComponent["default_values"]
		  }
		| {
				type: ComponentType.StringSelect
				options: APIStringSelectComponent["options"]
		  }
		| {
				type: ComponentType.RoleSelect
				default_values: APIRoleSelectComponent["default_values"]
		  }
		| {
				type: ComponentType.UserSelect
				default_values: APIUserSelectComponent["default_values"]
		  }
		| {
				type: ComponentType.MentionableSelect
				default_values: APIMentionableSelectComponent["default_values"]
		  }` | Yes |  |
| serializeExtra | `() => Record<string, unknown>` | Yes |  |
