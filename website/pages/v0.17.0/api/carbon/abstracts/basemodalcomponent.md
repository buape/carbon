---
title: BaseModalComponent
hidden: true
---

## class `BaseModalComponent`

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| type | `ComponentType` | Yes |  |
| isV2 | `unknown` | Yes |  |
| serialize | `() =>
		| APITextInputComponent
		| APILabelComponent2
		| APIFileUploadComponent
		| APICheckboxGroupActionComponent
		| APICheckboxActionComponent
		| APIRadioGroupActionComponent` | Yes |  |
