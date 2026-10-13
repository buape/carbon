---
title: RoleSelectMenu
hidden: true
---

## class `RoleSelectMenu`

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| type | `unknown` | Yes |  |
| isV2 | `unknown` | Yes |  |
| defaultValues | `APIRoleSelectComponent["default_values"]` | No |  |
| run | `(interaction: RoleSelectMenuInteraction, data: ComponentData) => unknown | Promise<unknown>` | Yes |  |
| serializeOptions | `() => void` | Yes |  |
