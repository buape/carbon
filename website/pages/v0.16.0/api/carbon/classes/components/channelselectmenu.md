---
title: ChannelSelectMenu
hidden: true
---

## class `ChannelSelectMenu`

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| type | `unknown` | Yes |  |
| isV2 | `unknown` | Yes |  |
| channelTypes | `APIChannelSelectComponent["channel_types"]` | No |  |
| defaultValues | `APIChannelSelectComponent["default_values"]` | No |  |
| run | `(interaction: ChannelSelectMenuInteraction, data: ComponentData) => unknown | Promise<unknown>` | Yes |  |
| serializeOptions | `() => void` | Yes |  |
