import type { BaseComponent } from "../structures/BaseComponent.js"

export class Row {
	/**
	 * The components in the action row
	 */
	components: BaseComponent[]

	constructor(components: BaseComponent[]) {
		this.components = components
	}

	/**
	 * Add a component to the action row
	 * @param component The component to add
	 */
	addComponent(component: BaseComponent) {
		this.components.push(component)
	}

	/**
	 * Remove a component from the action row
	 * @param component The component to remove
	 */
	removeComponent(component: BaseComponent) {
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

	serialize() {
		return {
			type: 1,
			components: this.components.map((component) => component.serialize())
		}
	}
}
