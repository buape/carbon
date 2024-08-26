import {
	type APIButtonComponent,
	type APIButtonComponentWithSKUId,
	type APIButtonComponentWithURL,
	ButtonStyle,
	ComponentType
} from "discord-api-types/v10"
import { BaseComponent } from "../structures/BaseComponent.js"
import type { ButtonInteraction } from "../structures/ButtonInteraction.js"

abstract class BaseButton extends BaseComponent {
	type = ComponentType.Button

	/**
	 * The label of the button
	 */
	abstract label: string

	/**
	 * The emoji of the button
	 */
	emoji?: {
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
}

export abstract class Button extends BaseButton {
	/**
	 * The style of the button
	 */
	abstract style: Exclude<ButtonStyle, ButtonStyle.Link | ButtonStyle.Premium>

	abstract run(interaction: ButtonInteraction): Promise<void>

	serialize = (): APIButtonComponent => {
		return {
			type: ComponentType.Button,
			style: this.style,
			label: this.label,
			custom_id: this.customId,
			disabled: this.disabled,
			emoji: this.emoji
		}
	}
}

export abstract class LinkButton extends BaseButton {
	customId = ""
	/**
	 * The URL that the button links to
	 */
	abstract url: string
	style: ButtonStyle.Link = ButtonStyle.Link

	serialize = (): APIButtonComponentWithURL => {
		return {
			type: ComponentType.Button,
			url: this.url,
			style: this.style,
			label: this.label,
			disabled: this.disabled,
			emoji: this.emoji
		}
	}
}

export abstract class PremiumButton extends BaseButton {
	style: ButtonStyle.Premium = ButtonStyle.Premium

	/**
	 * The SKU ID of the button
	 */
	abstract sku_id: string

	serialize = (): APIButtonComponentWithSKUId => {
		return {
			style: this.style,
			type: ComponentType.Button,
			disabled: this.disabled,
			sku_id: this.sku_id
		}
	}
}
