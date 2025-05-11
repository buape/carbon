import { Routes } from "discord-api-types/v9"
import { InteractionResponseType } from "discord-api-types/v9"
import type {
	APIMessageComponentButtonInteraction,
	APIMessageComponentInteraction,
	APIMessageComponentSelectMenuInteraction,
	RESTPostAPIInteractionCallbackJSONBody
} from "discord-api-types/v10"
import { Base } from "../abstracts/Base.js"
import type { BaseMessageInteractiveComponent } from "../abstracts/BaseMessageInteractiveComponent.js"
import { Button } from "../classes/components/Button.js"
import { ChannelSelectMenu } from "../classes/components/ChannelSelectMenu.js"
import { MentionableSelectMenu } from "../classes/components/MentionableSelectMenu.js"
import { RoleSelectMenu } from "../classes/components/RoleSelectMenu.js"
import { StringSelectMenu } from "../classes/components/StringSelectMenu.js"
import { UserSelectMenu } from "../classes/components/UserSelectMenu.js"
import { ButtonInteraction } from "./ButtonInteraction.js"
import { ChannelSelectMenuInteraction } from "./ChannelSelectMenuInteraction.js"
import { MentionableSelectMenuInteraction } from "./MentionableSelectMenuInteraction.js"
import { RoleSelectMenuInteraction } from "./RoleSelectMenuInteraction.js"
import { StringSelectMenuInteraction } from "./StringSelectMenuInteraction.js"
import { UserSelectMenuInteraction } from "./UserSelectMenuInteraction.js"

export class ComponentHandler extends Base {
	components: BaseMessageInteractiveComponent[] = []

	oneOffComponents: Map<
		`${string}-${string}`,
		{
			resolve: (id: string) => void
		}
	> = new Map()
	/**
	 * Register a component with the handler
	 * @internal
	 */
	registerComponent(component: BaseMessageInteractiveComponent) {
		if (!this.components.find((x) => x.customId === component.customId)) {
			this.components.push(component)
		}
	}
	/**
	 * Handle an interaction
	 * @internal
	 */
	async handleInteraction(data: APIMessageComponentInteraction) {
		const component = this.components.find((x) => {
			const componentKey = x.customIdParser(x.customId).key
			const interactionKey = x.customIdParser(data.data.custom_id).key
			return (
				componentKey === interactionKey && x.type === data.data.component_type
			)
		})
		if (!component) {
			const oneOffComponent = this.oneOffComponents.get(
				`${data.message.id}-${data.message.channel_id}`
			)

			if (oneOffComponent) {
				oneOffComponent.resolve(data.data.custom_id)
				this.oneOffComponents.delete(
					`${data.message.id}-${data.message.channel_id}`
				)
				await this.client.rest.post(
					Routes.interactionCallback(data.id, data.token),
					{
						body: {
							type: InteractionResponseType.DeferredMessageUpdate
						} as RESTPostAPIInteractionCallbackJSONBody
					}
				)
			}
			return
		}

		const parsed = component.customIdParser(data.data.custom_id)

		if (component instanceof Button) {
			const interaction = new ButtonInteraction(
				this.client,
				data as APIMessageComponentButtonInteraction,
				{ ephemeral: component.ephemeral }
			)
			if (component.defer) await interaction.defer()
			await component.run(interaction, parsed.data)
		} else if (component instanceof RoleSelectMenu) {
			const interaction = new RoleSelectMenuInteraction(
				this.client,
				data as APIMessageComponentSelectMenuInteraction,
				{ ephemeral: component.ephemeral }
			)
			if (component.defer) await interaction.defer()
			await component.run(interaction, parsed.data)
		} else if (component instanceof ChannelSelectMenu) {
			const interaction = new ChannelSelectMenuInteraction(
				this.client,
				data as APIMessageComponentSelectMenuInteraction,
				{ ephemeral: component.ephemeral }
			)
			if (component.defer) await interaction.defer()
			await component.run(interaction, parsed.data)
		} else if (component instanceof MentionableSelectMenu) {
			const interaction = new MentionableSelectMenuInteraction(
				this.client,
				data as APIMessageComponentSelectMenuInteraction,
				{ ephemeral: component.ephemeral }
			)
			if (component.defer) await interaction.defer()
			await component.run(interaction, parsed.data)
		} else if (component instanceof StringSelectMenu) {
			const interaction = new StringSelectMenuInteraction(
				this.client,
				data as APIMessageComponentSelectMenuInteraction,
				{ ephemeral: component.ephemeral }
			)
			if (component.defer) await interaction.defer()
			await component.run(interaction, parsed.data)
		} else if (component instanceof UserSelectMenu) {
			const interaction = new UserSelectMenuInteraction(
				this.client,
				data as APIMessageComponentSelectMenuInteraction,
				{ ephemeral: component.ephemeral }
			)
			if (component.defer) await interaction.defer()
			await component.run(interaction, parsed.data)
		} else {
			throw new Error(
				`Unknown component with type ${data.data.component_type} and custom ID ${data.data.custom_id}`
			)
		}
	}
}
