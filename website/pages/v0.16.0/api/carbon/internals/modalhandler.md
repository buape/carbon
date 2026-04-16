---
title: ModalHandler
hidden: true
---

## class `ModalHandler`

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| modals | `Modal[]` | Yes |  |
| registerModal | `(modal: Modal) => void` | Yes | Register a modal with the handler @internal |
| handleInteraction | `(data: APIModalSubmitInteraction) => void` | Yes | Handle an interaction @internal |
