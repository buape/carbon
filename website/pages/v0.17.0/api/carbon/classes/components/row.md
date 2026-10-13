---
title: Row
hidden: true
---

## class `Row`

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| type | `unknown` | Yes |  |
| isV2 | `unknown` | Yes |  |
| components | `T[]` | Yes | The components in the action row |
| addComponent | `(component: T) => void` | Yes | Add a component to the action row @param component The component to add |
| removeComponent | `(component: T) => void` | Yes | Remove a component from the action row @param component The component to remove |
| removeAllComponents | `() => void` | Yes | Remove all components from the action row |
| serialize | `unknown` | Yes |  |
