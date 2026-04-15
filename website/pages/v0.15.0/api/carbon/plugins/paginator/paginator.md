---
title: Paginator
hidden: true
---

## class `Paginator`

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| pages | `MessagePayloadObject[]` | Yes |  |
| id | `string` | Yes |  |
| currentPage | `unknown` | Yes |  |
| timeout | `NodeJS.Timeout | null` | Yes |  |
| timeoutDuration | `number` | Yes |  |
| userId | `string` | No | The user ID who is allowed to interact with the paginator |
| startTimeout | `() => void` | Yes |  |
| disableButtons | `() => void` | Yes |  |
| destroy | `() => void` | Yes |  |
| getCurrentPage | `() => MessagePayloadObject` | Yes |  |
| goToPage | `(pageIndex: number, interaction: ButtonInteraction) => void` | Yes |  |
| goToPageFromModal | `(pageIndex: number, interaction: ModalInteraction) => void` | Yes |  |
| createNavigationButtons | `(disabled: unknown) => Row<Button>` | Yes |  |
| getCurrentPageWithButtons | `() => MessagePayloadObject` | Yes |  |
| getInitialPage | `() => MessagePayloadObject` | Yes |  |
| send | `(interaction: CommandInteraction) => void` | Yes | Sends the paginator message using the provided interaction @param interaction The interaction to use for sending the message |
