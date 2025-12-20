import {
	type APITextDisplayComponent,
	ComponentType
} from "discord-api-types/v10"
import { BaseComponent } from "../../abstracts/BaseComponent.js"

export class TextDisplay extends BaseComponent {
	readonly type = ComponentType.TextDisplay as const
	readonly isV2 = true

	content?: string

	constructor(content?: string) {
		super()
		this.content = content
	}

	serialize = (): APITextDisplayComponent => {
		if (!this.content) {
			throw new Error("TextDisplay must have content")
		}
		return {
			type: this.type,
			id: this.id,
			content: this.content
		}
	}
}
