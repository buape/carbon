---
title: MentionableSelectMenu
hidden: true
---

## class `MentionableSelectMenu`

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| type | `unknown` | Yes |  |
| isV2 | `unknown` | Yes |  |
| defaultValues | `APIMentionableSelectComponent["default_values"]` | No |  |
| run | `(interaction: MentionableSelectMenuInteraction, data: ComponentData) => unknown | Promise<unknown>` | Yes |  |
| serializeOptions | `() => void` | Yes |  |
