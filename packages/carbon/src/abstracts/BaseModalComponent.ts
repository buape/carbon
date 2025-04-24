import type {
	APIComponentInModalActionRow,
	ComponentType
} from "discord-api-types/v10"
import { BaseComponent } from "./BaseComponent.js"
import type { ComponentAdditionalData } from "./BaseMessageInteractiveComponent.js"

export abstract class BaseModalComponent extends BaseComponent {
	abstract override type: ComponentType.TextInput

	readonly isV2 = false

	constructor(data?: {
		additionalData?: ComponentAdditionalData
	}) {
		super()
		if (data?.additionalData) this.additionalData = data.additionalData
	}

	/**
	 * The custom ID of the component
	 */
	abstract customId: string

	additionalData: ComponentAdditionalData | null = null

	/**
	 * Create a custom ID to use for this component that embeds additional data that you want to be handed
	 * @param additionalData The additional data that you want to be passed in this component's custom ID
	 * @returns The custom ID to use
	 */
	public createId = (additionalData: typeof this.additionalData) => {
		if (!additionalData) return this.customId
		// id:arg1=1;arg2=2
		const id = `${this.customId}:${Object.entries(additionalData)
			.map(([key, value]) => `${key}=${value}`)
			.join(";")}`
		return id
	}

	abstract serialize: () => APIComponentInModalActionRow
}
