import {
	type APIMediaGalleryComponent,
	ComponentType
} from "discord-api-types/v10"
import { BaseComponent } from "../../abstracts/BaseComponent.js"

/**
 * A media gallery component can display between 1 and 10 images.
 * Each image can be a direct online URL or an attachment://<name> reference.
 */
export class MediaGallery extends BaseComponent {
	readonly type = ComponentType.MediaGallery as const
	readonly isV2 = true

	items: Array<{
		url: string
		description?: string
		spoiler?: boolean
	}> = []

	constructor(
		items: Array<{
			url: string
			description?: string
			spoiler?: boolean
		}> = []
	) {
		super()
		this.items = items
	}

	serialize = (): APIMediaGalleryComponent => {
		if (this.items.length < 1 || this.items.length > 10) {
			throw new Error("MediaGallery must have between 1 and 10 items")
		}
		return {
			type: ComponentType.MediaGallery,
			id: this.id,
			items: this.items.map((item) => ({
				media: {
					url: item.url
				},
				description: item.description,
				spoiler: item.spoiler
			}))
		}
	}
}
