import type {
	APIMessageComponentButtonInteraction,
	APIMessageComponentInteraction,
	APIMessageComponentSelectMenuInteraction
} from "discord-api-types/v10"
import { Base } from "../abstracts/Base.js"
import type { BaseComponent } from "../abstracts/BaseComponent.js"
import { Button } from "../classes/Button.js"
import { ChannelSelectMenu } from "../classes/ChannelSelectMenu.js"
import { MentionableSelectMenu } from "../classes/MentionableSelectMenu.js"
import { RoleSelectMenu } from "../classes/RoleSelectMenu.js"
import { StringSelectMenu } from "../classes/StringSelectMenu.js"
import { UserSelectMenu } from "../classes/UserSelectMenu.js"
import { ButtonInteraction } from "./ButtonInteraction.js"
import { ChannelSelectMenuInteraction } from "./ChannelSelectMenuInteraction.js"
import { MentionableSelectMenuInteraction } from "./MentionableSelectMenuInteraction.js"
import { RoleSelectMenuInteraction } from "./RoleSelectMenuInteraction.js"
import { StringSelectMenuInteraction } from "./StringSelectMenuInteraction.js"
import { UserSelectMenuInteraction } from "./UserSelectMenuInteraction.js"

export class ComponentHandler extends Base {
	components: BaseComponent[] = []
	/**
	 * Register a component with the handler
	 * @internal
	 */
	registerComponent(component: BaseComponent) {
		if (!this.components.find((x) => x.customId === component.customId)) {
			this.components.push(component)
		}
	}
	/**
	 * Handle an interaction
	 * @internal
	 */
	async handleInteraction(data: APIMessageComponentInteraction) {
		const component = this.components.find(
			(x) =>
				x.customId === data.data.custom_id &&
				x.type === data.data.component_type
		)
		if (!component) return false

		if (component instanceof Button) {
			const interaction = new ButtonInteraction(
				this.client,
				data as APIMessageComponentButtonInteraction,
				{ ephemeral: component.ephemeral }
			)
			if (component.defer) await interaction.defer()
			await component.run(interaction)
		} else if (component instanceof RoleSelectMenu) {
			const interaction = new RoleSelectMenuInteraction(
				this.client,
				data as APIMessageComponentSelectMenuInteraction,
				{ ephemeral: component.ephemeral }
			)
			if (component.defer) await interaction.defer()
			await component.run(interaction)
		} else if (component instanceof ChannelSelectMenu) {
			const interaction = new ChannelSelectMenuInteraction(
				this.client,
				data as APIMessageComponentSelectMenuInteraction,
				{ ephemeral: component.ephemeral }
			)
			if (component.defer) await interaction.defer()
			await component.run(interaction)
		} else if (component instanceof MentionableSelectMenu) {
			const interaction = new MentionableSelectMenuInteraction(
				this.client,
				data as APIMessageComponentSelectMenuInteraction,
				{ ephemeral: component.ephemeral }
			)
			if (component.defer) await interaction.defer()
			await component.run(interaction)
		} else if (component instanceof StringSelectMenu) {
			const interaction = new StringSelectMenuInteraction(
				this.client,
				data as APIMessageComponentSelectMenuInteraction,
				{ ephemeral: component.ephemeral }
			)
			if (component.defer) await interaction.defer()
			await component.run(interaction)
		} else if (component instanceof UserSelectMenu) {
			const interaction = new UserSelectMenuInteraction(
				this.client,
				data as APIMessageComponentSelectMenuInteraction,
				{ ephemeral: component.ephemeral }
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
