---
title: ComponentHandler
hidden: true
---

## class `ComponentHandler`

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| componentCache | `unknown` | Yes |  |
| componentParsersByType | `unknown` | Yes |  |
| oneOffComponents | `Map<
		`${string}-${string}`,
		{
			resolve: (data: APIMessageComponentInteractionData) => void
		}
	>` | Yes |  |
| getComponentCacheKey | `(key: string, componentType: ComponentType) => string` | Yes |  |
| registerComponent | `(component: BaseMessageInteractiveComponent) => void` | Yes |  |
| hasComponentWithKey | `(key: string, componentType: ComponentType) => boolean` | Yes |  |
| findComponent | `(customId: string, componentType: ComponentType) => BaseMessageInteractiveComponent | undefined` | Yes |  |
| runComponent | `(component: BaseMessageInteractiveComponent, interaction: BaseComponentInteraction, parsed: ReturnType<BaseMessageInteractiveComponent["customIdParser"]>) => Promise<void>` | Yes |  |
| handleInteraction | `(data: APIMessageComponentInteraction) => void` | Yes |  |
| handleInteractionInternal | `(data: APIMessageComponentInteraction) => void` | Yes |  |
