import {
	ComponentType,
	type APIActionRowComponent,
	type APIMessageActionRowComponent
} from "discord-api-types/v10"
import type { BaseComponent } from "../abstracts/BaseComponent.js"

export class Row<T extends BaseComponent = BaseComponent> {
	/**
	 * The components in the action row
	 */
	components: T[] = []

	constructor(components?: T[]) {
		if (components) this.components = components
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

	serialize = (): APIActionRowComponent<APIMessageActionRowComponent> => {
		return {
			type: ComponentType.ActionRow,
			components: this.components.map((component) =>
				component.serialize()
			) as APIMessageActionRowComponent[]
		}
	}
}
