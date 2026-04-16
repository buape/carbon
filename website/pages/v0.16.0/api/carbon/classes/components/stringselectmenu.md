---
title: StringSelectMenu
hidden: true
---

## class `StringSelectMenu`

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| type | `unknown` | Yes |  |
| isV2 | `unknown` | Yes |  |
| options | `APIStringSelectComponent["options"]` | Yes |  |
| run | `(interaction: StringSelectMenuInteraction, data: ComponentData) => unknown | Promise<unknown>` | Yes |  |
| serializeOptions | `() => void` | Yes |  |
