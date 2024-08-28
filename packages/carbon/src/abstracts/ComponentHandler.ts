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
	async handleInteraction(data: APIMessageComponentInteraction) {
		const allComponents = this.client.commands
			.filter((x) => x.components && x.components.length > 0)
			.flatMap((x) => x.components) as BaseComponent[]
		const component = allComponents.find(
			(x) =>
				x.customId === data.data.custom_id &&
				x.type === data.data.component_type
		)
		if (!component) return false

		if (component instanceof Button) {
			const interaction = new ButtonInteraction(
				this.client,
				data as APIMessageComponentButtonInteraction
			)
			if (component.defer) await interaction.defer()
			await component.run(interaction)
		} else if (component instanceof RoleSelectMenu) {
			const interaction = new RoleSelectMenuInteraction(
				this.client,
				data as APIMessageComponentSelectMenuInteraction
			)
			if (component.defer) await interaction.defer()
			await component.run(interaction)
		} else if (component instanceof ChannelSelectMenu) {
			const interaction = new ChannelSelectMenuInteraction(
				this.client,
				data as APIMessageComponentSelectMenuInteraction
			)
			if (component.defer) await interaction.defer()
			await component.run(interaction)
		} else if (component instanceof MentionableSelectMenu) {
			const interaction = new MentionableSelectMenuInteraction(
				this.client,
				data as APIMessageComponentSelectMenuInteraction
			)
			if (component.defer) await interaction.defer()
			await component.run(interaction)
		} else if (component instanceof StringSelectMenu) {
			const interaction = new StringSelectMenuInteraction(
				this.client,
				data as APIMessageComponentSelectMenuInteraction
			)
			if (component.defer) await interaction.defer()
			await component.run(interaction)
		} else if (component instanceof UserSelectMenu) {
			const interaction = new UserSelectMenuInteraction(
				this.client,
				data as APIMessageComponentSelectMenuInteraction
			)
			if (component.defer) await interaction.defer()
			await component.run(interaction)
		} else {
			throw new Error(
				`Unknown component with type ${data.data.component_type} and custom ID ${data.data.custom_id}`
			)
		}
	}
}
