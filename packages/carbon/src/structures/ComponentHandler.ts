import { Base } from "./Base.js"
import { Button } from "../classes/Button.js"
import { ButtonInteraction } from "./ButtonInteraction.js"
import type {
	APIMessageComponentButtonInteraction,
	APIMessageComponentInteraction,
	APIMessageComponentSelectMenuInteraction
} from "discord-api-types/v10"
import type { BaseComponent } from "./BaseComponent.js"
import { RoleSelectMenu } from "../classes/RoleSelectMenu.js"
import { ChannelSelectMenu } from "../classes/ChannelSelectMenu.js"
import { MentionableSelectMenu } from "../classes/MentionableSelectMenu.js"
import { StringSelectMenu } from "../classes/StringSelectMenu.js"
import { UserSelectMenu } from "../classes/UserSelectMenu.js"
import { RoleSelectMenuInteraction } from "./RoleSelectMenuInteraction.js"
import { UserSelectMenuInteraction } from "./UserSelectMenuInteraction.js"
import { StringSelectMenuInteraction } from "./StringSelectMenuInteraction.js"
import { MentionableSelectMenuInteraction } from "./MentionableSelectMenuInteraction.js"
import { ChannelSelectMenuInteraction } from "./ChannelSelectMenuInteraction.js"

export class ComponentHandler extends Base {
	handleInteraction(data: APIMessageComponentInteraction) {
		const allComponents = this.client.commands
			.filter((x) => x.components && x.components.length > 0)
			.flatMap((x) => x.components) as BaseComponent[]
		const component = allComponents.find(
			(x) =>
				x.customId === data.data.custom_id &&
				x.type === data.data.component_type
		)
		if (!component) return

		if (component instanceof Button) {
			component.run(
				new ButtonInteraction(
					this.client,
					data as APIMessageComponentButtonInteraction
				)
			)
		} else if (component instanceof RoleSelectMenu) {
			component.run(
				new RoleSelectMenuInteraction(
					this.client,
					data as APIMessageComponentSelectMenuInteraction
				)
			)
		} else if (component instanceof ChannelSelectMenu) {
			component.run(
				new ChannelSelectMenuInteraction(
					this.client,
					data as APIMessageComponentSelectMenuInteraction
				)
			)
		} else if (component instanceof MentionableSelectMenu) {
			component.run(
				new MentionableSelectMenuInteraction(
					this.client,
					data as APIMessageComponentSelectMenuInteraction
				)
			)
		} else if (component instanceof StringSelectMenu) {
			component.run(
				new StringSelectMenuInteraction(
					this.client,
					data as APIMessageComponentSelectMenuInteraction
				)
			)
		} else if (component instanceof UserSelectMenu) {
			component.run(
				new UserSelectMenuInteraction(
					this.client,
					data as APIMessageComponentSelectMenuInteraction
				)
			)
		} else {
			throw new Error("Unknown component type")
		}
	}
}
