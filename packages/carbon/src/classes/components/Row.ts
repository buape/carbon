import { ComponentType } from "discord-api-types/v10"
import { BaseComponent } from "../../abstracts/BaseComponent.js"
import type { BaseMessageInteractiveComponent } from "../../abstracts/BaseMessageInteractiveComponent.js"
import type { APIActionRowComponent2 } from "../../types/index.js"

export class Row<
	T extends BaseMessageInteractiveComponent
> extends BaseComponent {
	readonly type = ComponentType.ActionRow as const
	get isV2() {
		return this.components.some((component) => component.isV2)
	}

	/**
	 * The components in the action row
	 */
	components: T[] = []

	constructor(components: T[] = []) {
		super()
		this.components = components
	}

	/**
	 * Add a component to the action row
	 * @param component The component to add
	 */
	addComponent(component: T) {
		this.components.push(component)
	}

	/**
	 * Remove a component from the action row
	 * @param component The component to remove
	 */
	removeComponent(component: T) {
		const index = this.components.indexOf(component)
		if (index === -1) return
		this.components.splice(index, 1)
	}

	/**
	 * Remove all components from the action row
	 */
	removeAllComponents() {
		this.components = []
	}

	serialize = (): APIActionRowComponent2 => {
		return {
			type: ComponentType.ActionRow,
			components: this.components.map((component) => {
				const data = component.serialize()
				if (data.type === 26) {
					throw new Error(
						"Menu action items must be placed inside an OverflowMenu"
					)
				}
				return data
			})
		}
	}
}
