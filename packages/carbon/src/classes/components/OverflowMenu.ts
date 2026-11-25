import type { APIOverflowMenuComponent } from "discord-api-types/v10"
import { BaseMessageInteractiveComponent } from "../../abstracts/BaseMessageInteractiveComponent.js"
import type { LinkMenuActionItem, MenuActionItem } from "./MenuActionItem.js"

export type OverflowMenuGroup = {
	label?: string
	components: (MenuActionItem | LinkMenuActionItem)[]
}

export class OverflowMenu extends BaseMessageInteractiveComponent {
	readonly type = 25 as const // TODO: ComponentType.OverflowMenu
	readonly isV2 = true
	// Only nested action items produce interactions; this ID is not serialized.
	customId = "overflow-menu"

	groups: OverflowMenuGroup[] = []

	constructor(groups: OverflowMenuGroup[] = []) {
		super()
		this.groups = groups
	}

	serialize = (): APIOverflowMenuComponent => ({
		type: this.type,
		id: this.id,
		groups: this.groups.map((group) => ({
			label: group.label,
			components: group.components.map((component) => component.serialize())
		}))
	})
}
