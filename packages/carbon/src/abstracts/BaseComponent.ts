import type { APIBaseComponent, ComponentType } from "discord-api-types/v10"

export type ComponentAdditionalData = {
	[key: string]: string | number | boolean
}

export abstract class BaseComponent {
	constructor(data?: {
		additionalData?: ComponentAdditionalData
	}) {
		if (data?.additionalData) this.additionalData = data.additionalData
	}

	/**
	 * Whether the component response should be automatically deferred
	 */
	defer = false
	/**
	 * Whether the component response should be ephemeral
	 */
	ephemeral = false

	/**
	 * The type of the component
	 */
	abstract type: ComponentType
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

	abstract serialize: () => APIBaseComponent<typeof this.type>
}
