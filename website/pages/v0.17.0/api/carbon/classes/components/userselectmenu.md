---
title: UserSelectMenu
hidden: true
---

## class `UserSelectMenu`

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| type | `unknown` | Yes |  |
| isV2 | `unknown` | Yes |  |
| defaultValues | `APIUserSelectComponent["default_values"]` | No |  |
| run | `(interaction: UserSelectMenuInteraction, data: ComponentData) => unknown | Promise<unknown>` | Yes |  |
| serializeOptions | `() => void` | Yes |  |
