import { ComponentType } from "discord-api-types/v10"
import { BaseComponent } from "../../abstracts/BaseComponent.js"
import type { APISectionComponent2 } from "../../types/index.js"
import type { Button, LinkButton } from "./Button.js"
import type { OverflowMenu } from "./OverflowMenu.js"
import type { TextDisplay } from "./TextDisplay.js"
import type { Thumbnail } from "./Thumbnail.js"

export class Section extends BaseComponent {
	readonly type = ComponentType.Section as const
	readonly isV2 = true

	/**
	 * This is the main text that will be displayed in the section.
	 * You can have 1-3 TextDisplays in a Section
	 */
	components: TextDisplay[] = []

	/**
	 * The Thumbnail, Button, or OverflowMenu displayed to the right of the main text.
	 * You can only have 1 accessory in a Section.
	 * If you don't want an accessory, you should be just using the TextDisplay directly.
	 */
	accessory: Thumbnail | Button | LinkButton | OverflowMenu | undefined

	constructor(
		components: TextDisplay[] = [],
		accessory?: Thumbnail | Button | LinkButton | OverflowMenu
	) {
		super()
		this.components = components
		this.accessory = accessory
	}

	serialize = (): APISectionComponent2 => {
		if (!this.components || this.components.length === 0) {
			throw new Error(
				"Sections must contain at least one TextDisplay component"
			)
		}
		if (!this.accessory) {
			throw new Error("Sections must have an accessory component")
		}
		return {
			type: this.type,
			id: this.id,
			components: this.components.map((component) => component.serialize()),
			accessory: this.accessory.serialize()
		}
	}
}
