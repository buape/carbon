---
title: Section
hidden: true
---

## class `Section`

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| type | `unknown` | Yes |  |
| isV2 | `unknown` | Yes |  |
| components | `TextDisplay[]` | Yes | This is the main text that will be displayed in the section. You can have 1-3 TextDisplays in a Section |
| accessory | `Thumbnail | Button | LinkButton | undefined` | Yes | The Thumbnail or Button that will be displayed to the right of the main text. You can only have 1 Thumbnail or Button in a Section. If you don't want an accessory, you should be just using the TextDisplay directly. |
| serialize | `unknown` | Yes |  |
