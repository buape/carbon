import {
	type APIActionRowComponent,
	type APIComponentInMessageActionRow,
	type APIComponentInModalActionRow,
	ComponentType
} from "discord-api-types/v10"
import { BaseComponent } from "../../abstracts/BaseComponent.js"
import type { BaseMessageInteractiveComponent } from "../../abstracts/BaseMessageInteractiveComponent.js"
import type { BaseModalComponent } from "../../abstracts/BaseModalComponent.js"

export class Row<
	T extends
		| BaseMessageInteractiveComponent
		| BaseModalComponent = BaseMessageInteractiveComponent
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

	serialize = (): ReturnType<BaseComponent["serialize"]> => {
		return {
			type: ComponentType.ActionRow,
			components: this.components.map((component) => component.serialize())
		} satisfies APIActionRowComponent<
			APIComponentInMessageActionRow | APIComponentInModalActionRow
		> as unknown as ReturnType<BaseComponent["serialize"]>
		// god i hate these types
	}
}
