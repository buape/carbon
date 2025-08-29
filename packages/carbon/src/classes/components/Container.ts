import {
	type APIComponentInContainer,
	type APIContainerComponent,
	ComponentType
} from "discord-api-types/v10"
import { BaseComponent } from "../../abstracts/BaseComponent.js"
import type { BaseMessageInteractiveComponent } from "../../abstracts/BaseMessageInteractiveComponent.js"
import type { File } from "./File.js"
import type { MediaGallery } from "./MediaGallery.js"
import type { Row } from "./Row.js"
import type { Section } from "./Section.js"
import type { Separator } from "./Separator.js"
import type { TextDisplay } from "./TextDisplay.js"

export abstract class Container extends BaseComponent {
	readonly type = ComponentType.Container as const
	readonly isV2 = true

	abstract components: (
		| Row<BaseMessageInteractiveComponent>
		| TextDisplay
		| Section
		| MediaGallery
		| Separator
		| File
	)[]

	/**
	 * The accent color of the container
	 */
	accentColor?: `#${string}` | string | number

	/**
	 * Whether the container should be marked a spoiler
	 */
	spoiler = false

	serialize = (): APIContainerComponent => {
		return {
			type: this.type,
			components: this.components.map((component) =>
				component.serialize()
			) as APIComponentInContainer[],
			accent_color: this.accentColor
				? typeof this.accentColor === "string"
					? Number.parseInt(this.accentColor.slice(1), 16)
					: this.accentColor
				: undefined,
			spoiler: this.spoiler
		}
	}
}
