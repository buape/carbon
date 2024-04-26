import { Base } from "./Base.js"
import { Collector } from "./Collector.js"
import { Button } from "../classes/Button.js"
import { ButtonInteraction } from "./ButtonInteraction.js"
import type {
	APIMessageComponentButtonInteraction,
	APIMessageComponentInteraction,
	APIMessageComponentSelectMenuInteraction
} from "discord-api-types/v10"
import { BaseComponentInteraction } from "./BaseComponentInteraction.js"
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
	collectors: Collector[] = []

	registerComponent(component: BaseComponent) {
		this.addCollector(new Collector(this.client, component.filter, component))
	}

	addCollector(collector: Collector) {
		this.collectors.push(collector)
	}

	removeCollector(collector: Collector) {
		this.collectors = this.collectors.filter((c) => c !== collector)
	}

	async handleInteraction(rawInteraction: APIMessageComponentInteraction) {
		const interaction = new BaseComponentInteraction(
			this.client,
			rawInteraction
		)
		const passed = this.collectors.filter((c) => c.check(interaction))
		if (!passed.length)
			return interaction.reply({
				content: `Component is not cached: ${JSON.stringify({
					componentType: interaction.componentType,
					customId: interaction.customId
				})}`
			})
		for (const collector of passed) {
			if (collector.component instanceof Button) {
				collector.component.run(
					new ButtonInteraction(
						this.client,
						interaction.rawData as APIMessageComponentButtonInteraction
					)
				)
			} else if (collector.component instanceof RoleSelectMenu) {
				collector.component.run(
					new RoleSelectMenuInteraction(
						this.client,
						interaction.rawData as APIMessageComponentSelectMenuInteraction
					)
				)
			} else if (collector.component instanceof ChannelSelectMenu) {
				collector.component.run(
					new ChannelSelectMenuInteraction(
						this.client,
						interaction.rawData as APIMessageComponentSelectMenuInteraction
					)
				)
			} else if (collector.component instanceof MentionableSelectMenu) {
				collector.component.run(
					new MentionableSelectMenuInteraction(
						this.client,
						interaction.rawData as APIMessageComponentSelectMenuInteraction
					)
				)
			} else if (collector.component instanceof StringSelectMenu) {
				collector.component.run(
					new StringSelectMenuInteraction(
						this.client,
						interaction.rawData as APIMessageComponentSelectMenuInteraction
					)
				)
			} else if (collector.component instanceof UserSelectMenu) {
				collector.component.run(
					new UserSelectMenuInteraction(
						this.client,
						interaction.rawData as APIMessageComponentSelectMenuInteraction
					)
				)
			}
		}
	}
}
