import {
	type APIMediaGalleryComponent,
	ComponentType
} from "discord-api-types/v10"
import { BaseComponent } from "../../abstracts/BaseComponent.js"

/**
 * A media gallery component can display between 1 and 10 images.
 * Each image can be a direct online URL or an attachment://<name> reference.
 */
export abstract class MediaGallery extends BaseComponent {
	readonly type = ComponentType.MediaGallery as const
	readonly isV2 = true

	abstract items: {
		/**
		 * The URL of the image. This can either be a direct online URL or an attachment://<name> reference
		 */
		url: string
		/**
		 * The alt text for the image.
		 */
		description?: string
		/**
		 * Whether the image is a spoiler.
		 * @default false
		 */
		spoiler?: boolean
	}[]

	serialize = (): APIMediaGalleryComponent => {
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
