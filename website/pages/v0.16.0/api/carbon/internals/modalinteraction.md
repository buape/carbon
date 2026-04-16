---
title: ModalInteraction
hidden: true
---

## class `ModalInteraction`

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| customId | `string` | Yes |  |
| fields | `FieldsHandler` | Yes |  |
| acknowledge | `() => void` | Yes | Acknowledge the interaction, the user does not see a loading state. This can only be used for modals triggered from components |
| update | `(data: MessagePayload) => void` | Yes | Update the original message of the component. This can only be used for modals triggered from components |
