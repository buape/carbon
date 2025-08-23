import { StringSelectMenu } from "./StringSelectMenu.js"

export abstract class ModalStringSelectMenu extends StringSelectMenu {
	required = false
	override disabled: false = false

	serializeExtra() {
		return {
			required: this.required
		}
	}

	// Discord will give an error if this key is in the payload
	protected get serializeDeleteKeys(): string[] {
		return ["disabled"]
	}
}
