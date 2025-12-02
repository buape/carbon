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

export class Container extends BaseComponent {
	readonly type = ComponentType.Container as const
	readonly isV2 = true

	components: (
		| Row<BaseMessageInteractiveComponent>
		| TextDisplay
		| Section
		| MediaGallery
		| Separator
		| File
	)[] = []

	/**
	 * The accent color of the container
	 */
	accentColor?: `#${string}` | string | number

	/**
	 * Whether the container should be marked a spoiler
	 */
	spoiler = false

	constructor(
		components: (
			| Row<BaseMessageInteractiveComponent>
			| TextDisplay
			| Section
			| MediaGallery
			| Separator
			| File
		)[] = [],
		options:
			| { accentColor?: `#${string}` | string | number; spoiler?: boolean }
			| string
			| number = {}
	) {
		super()
		this.components = components

		if (typeof options === "string" || typeof options === "number") {
			this.accentColor = options
		} else {
			this.accentColor = options.accentColor
			if (options.spoiler !== undefined) {
				this.spoiler = options.spoiler
			}
		}
	}

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
