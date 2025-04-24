import { type APISectionComponent, ComponentType } from "discord-api-types/v10"
import { BaseComponent } from "../../abstracts/BaseComponent.js"
import type { Button, LinkButton } from "./Button.js"
import type { TextDisplay } from "./TextDisplay.js"
import type { Thumbnail } from "./Thumbnail.js"

export abstract class Section extends BaseComponent {
	readonly type = ComponentType.Section as const
	readonly isV2 = true

	/**
	 * This is the main text that will be displayed in the section.
	 * You can have 1-3 TextDisplays in a Section
	 */
	abstract components: TextDisplay[]

	/**
	 * The Thumbnail or Button that will be displayed to the right of the main text.
	 * You can only have 1 Thumbnail or Button in a Section.
	 * If you don't want an accessory, you should be just using the TextDisplay directly.
	 */
	abstract accessory: Thumbnail | Button | LinkButton

	serialize = (): APISectionComponent => {
		return {
			type: this.type,
			id: this.id,
			components: this.components.map((component) => component.serialize()),
			accessory: this.accessory?.serialize()
		}
	}
}
