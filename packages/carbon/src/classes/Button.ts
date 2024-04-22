import { ButtonStyle, ComponentType } from "discord-api-types/v10"
import {
	BaseComponent,
	type ComponentAdditionalData
} from "../structures/BaseComponent.js"
import type { ButtonInteraction } from "../structures/ButtonInteraction.js"

abstract class BaseButton<
	T extends ComponentAdditionalData
> extends BaseComponent<T> {
	type = ComponentType.Button

	/**
	 * The custom ID of the button
	 */
	abstract customId: string

	/**
	 * The label of the button
	 */
	abstract label: string

	/**
	 * The emoji of the button
	 */
	abstract emoji?: {
		name: string
		id?: string
		animated?: boolean
	}

	/**
	 * The style of the button
	 */
	style: ButtonStyle = ButtonStyle.Primary

	/**
	 * The disabled state of the button
	 */
	disabled = false

	abstract handle: (interaction: ButtonInteraction) => void
}

export abstract class Button<
	T extends ComponentAdditionalData
> extends BaseButton<T> {
	/**
	 * The style of the button
	 */
	abstract style: Exclude<ButtonStyle, ButtonStyle.Link>
}

export abstract class LinkButton extends BaseButton<null> {
	/**
	 * The URL that the button links to
	 */
	abstract url: string
	style = ButtonStyle.Link
}
