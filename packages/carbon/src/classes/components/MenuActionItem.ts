import type {
	APIMenuActionItemComponent,
	APIMessageComponentEmoji
} from "discord-api-types/v10"
import { BaseMessageInteractiveComponent } from "../../abstracts/BaseMessageInteractiveComponent.js"
import type { MenuActionItemInteraction } from "../../internals/MenuActionItemInteraction.js"
import type { ComponentData } from "../../types/index.js"

// TODO: Use MenuActionItemStyle from discord-api-types when available.
export enum MenuActionItemStyle {
	Default = 1,
	Danger = 2,
	Link = 3
}

abstract class BaseMenuActionItem extends BaseMessageInteractiveComponent {
	readonly type = 26 as const // TODO: ComponentType.MenuActionItem
	abstract label: string
	style: MenuActionItemStyle = MenuActionItemStyle.Default
	description?: string
	emoji?: APIMessageComponentEmoji
}

export abstract class MenuActionItem extends BaseMenuActionItem {
	run(
		_interaction: MenuActionItemInteraction,
		_data: ComponentData
	): unknown | Promise<unknown> {
		return
	}

	serialize = (): APIMenuActionItemComponent => {
		if (this.style === MenuActionItemStyle.Link) {
			throw new Error("Use LinkMenuActionItem for link-style menu items")
		}
		return {
			type: this.type,
			id: this.id,
			custom_id: this.customId,
			label: this.label,
			style: this.style,
			description: this.description,
			emoji: this.emoji
		}
	}
}

export abstract class LinkMenuActionItem extends BaseMenuActionItem {
	customId = "link"
	abstract url: string
	style: MenuActionItemStyle.Link = MenuActionItemStyle.Link

	run = async () => {
		throw new Error("Link menu action items cannot be used in a run method")
	}

	serialize = (): APIMenuActionItemComponent => ({
		type: this.type,
		id: this.id,
		label: this.label,
		style: this.style,
		url: this.url,
		description: this.description,
		emoji: this.emoji
	})
}
