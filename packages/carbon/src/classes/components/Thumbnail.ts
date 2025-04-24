import type { APIThumbnailComponent } from "discord-api-types/v10"
import { ComponentType } from "discord-api-types/v10"
import { BaseComponent } from "../../abstracts/BaseComponent.js"

export abstract class Thumbnail extends BaseComponent {
	readonly type = ComponentType.Thumbnail as const
	readonly isV2 = true

	/**
	 * The URL of the thumbnail. This can either be a direct online URL or an attachment://<name> reference
	 */
	abstract url: string

	serialize = (): APIThumbnailComponent => {
		return {
			type: this.type,
			id: this.id,
			media: {
				url: this.url
			}
		}
	}
}
