---
title: BaseComponent
hidden: true
---

## class `BaseComponent`

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| type | `ComponentType | number` | Yes | The type of the component |
| isV2 | `boolean` | Yes | Whether the component is a v2 component and requires the IS_COMPONENTS_V2 flag |
| id | `number` | No | 32 bit integer used as an optional identifier for component The id field is optional and is used to identify components in the response from an interaction that aren't interactive components. The id must be unique within the message and is generated sequentially by Discord if left empty. Generation of ids won't use another id that exists in the message if you have one defined for another component. |
| serialize | `() => APIMessageComponent | APIModalComponent2` | Yes |  |
