import type { ComponentType } from "discord-api-types/v10"
import type { BaseComponentInteraction } from "./BaseInteraction.js"

export type ComponentAdditionalData = {
	[key: string]: string | number | boolean
} | null

export abstract class BaseComponent<T extends ComponentAdditionalData> {
	/**
	 * The type of the component
	 */
	abstract type: ComponentType

	/**
	 * The custom ID of the component
	 */
	abstract customId: string

	/**
	 * Whether the command response should be automatically deferred
	 */
	defer = false
	/**
	 * Whether the command response should be ephemeral
	 */
	ephemeral = false

	/**
	 * Create a custom ID to use for this component that embeds additional data that you want to be handed
	 * @param additionalData The additional data that you want to be passed in this component's custom ID
	 * @returns The custom ID to use
	 */
	public createId = (additionalData: T) => {
		if (!additionalData) return this.customId
		// id:arg1=1;arg2=2
		const id = `${this.customId}:${Object.entries(additionalData)
			.map(([key, value]) => `${key}=${value}`)
			.join(";")}`
		return id
	}

	abstract handle: (interaction: BaseComponentInteraction) => void
}
