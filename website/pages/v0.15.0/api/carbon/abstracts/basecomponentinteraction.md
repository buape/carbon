---
title: BaseComponentInteraction
hidden: true
---

## class `BaseComponentInteraction`

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| componentType | `ComponentType` | Yes |  |
| acknowledge | `() => void` | Yes | Acknowledge the interaction, the user does not see a loading state. This can only be used for component interactions |
| update | `(data: MessagePayload) => void` | Yes | Update the original message of the component |
