import type { APIFileComponent } from "discord-api-types/v10"
import { ComponentType } from "discord-api-types/v10"
import { BaseComponent } from "../../abstracts/BaseComponent.js"

/**
 * Each file component can only display 1 attached file, but you can upload multiple files and add them to different file components within your payload.
 */
export class File extends BaseComponent {
	readonly type = ComponentType.File as const
	readonly isV2 = true

	/**
	 * The attachment to display in the file component.
	 */
	file: `attachment://${string}`

	/**
	 * Whether the file should be displayed as a spoiler.
	 */
	spoiler = false

	constructor(file: `attachment://${string}`, spoiler?: boolean) {
		super()
		this.file = file
		this.spoiler = spoiler ?? false
	}

	serialize = (): APIFileComponent => {
		return {
			type: ComponentType.File,
			file: {
				url: this.file
			},
			spoiler: this.spoiler
		}
	}
}
