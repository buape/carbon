import {
	type APIActionRowComponent,
	type APIComponentInMessageActionRow,
	ComponentType
} from "discord-api-types/v10"
import { BaseComponent } from "../../abstracts/BaseComponent.js"
import type { BaseMessageInteractiveComponent } from "../../abstracts/BaseMessageInteractiveComponent.js"

export class Row<
	T extends BaseMessageInteractiveComponent
> extends BaseComponent {
	readonly type = ComponentType.ActionRow as const
	readonly isV2 = false

	/**
	 * The components in the action row
	 */
	components: T[] = []

	constructor(components?: T[]) {
		super()
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

	serialize = (): APIActionRowComponent<APIComponentInMessageActionRow> => {
		return {
			type: ComponentType.ActionRow,
			components: this.components.map((component) => component.serialize())
		}
	}
}
