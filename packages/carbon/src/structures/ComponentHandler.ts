import { Base } from "./Base.js"
import { Collector } from "./Collector.js"
import { Button } from "../classes/Button.js"
import { ButtonInteraction } from "./ButtonInteraction.js"
import type {
	APIMessageComponentButtonInteraction,
	APIMessageComponentInteraction
} from "discord-api-types/v10"
import { BaseComponentInteraction } from "./BaseComponentInteraction.js"
import type { BaseComponent } from "./BaseComponent.js"

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
		if (!passed.length) return
		for (const collector of passed) {
			if (collector.component instanceof Button) {
				collector.component.run(
					new ButtonInteraction(
						this.client,
						interaction.rawData as APIMessageComponentButtonInteraction
					)
				)
			}
		}
	}
}
