import type { ComponentType } from "discord-api-types/v10"
import type { BaseComponent } from "./BaseComponent.js"
import type { BaseComponentInteraction } from "./BaseComponentInteraction.js"
import { Base } from "./Base.js"
import type { Client } from "../classes/Client.js"

export type ComponentFilter = {
	/**
	 * The user (or users) that should be allowed to run the component
	 */
	userId?: string | string[]
	/**
	 * The maximum amount of users that can run the component
	 */
	maxUsers?: number
	/**
	 * The maximum amount of idle time that the collector should stop listening after
	 */
	idle?: number
	/**
	 * The type of the component
	 */
	type: ComponentType
	/**
	 * The custom ID of the component
	 */
	customId: string
}
/**
 * Collects interactions to a specified custom ID of a component
 */
export class Collector extends Base {
	/**
	 * The filter that the collector will compare all interactions against
	 */
	readonly filter: ComponentFilter
	/**
	 * The component that will be ran when the collector collects an interaction that passes the filter.
	 */
	readonly component: BaseComponent

	usersProcessed: ComponentFilter["userId"][] = []

	private lastRan = Date.now()
	private idleTimeout: ReturnType<typeof setTimeout> | null = null

	constructor(
		client: Client,
		filter: ComponentFilter | null,
		component: BaseComponent
	) {
		super(client)
		this.filter = filter || {
			type: component.type,
			customId: component.customId
		}
		this.component = component

		this.lastRan = Date.now()
		this.resetTimeout()
	}

	/**
	 * Checks if an interaction passes the filter
	 * @param interaction The interaction to check
	 * @param noIncrement If the collector should not increment the usersProcessed array
	 * @returns If the interaction passes the filter
	 */
	public check(interaction: BaseComponentInteraction, noIncrement = false) {
		if (this.filter.type !== interaction.componentType) return false
		if (this.filter.customId !== interaction.customId) return false
		if (
			this.filter.userId &&
			interaction.userId &&
			!this.filter.userId.includes(interaction.userId)
		)
			return false

		if (this.filter.maxUsers) {
			if (this.usersProcessed.length >= this.filter.maxUsers) return false
		}

		if (!noIncrement) this.usersProcessed.push(interaction.userId)
		if (this.idleTimeout) {
			clearTimeout(this.idleTimeout)
			this.idleTimeout = setTimeout(() => {
				this.stop()
			}, this.filter.idle)
		}
		if (
			!this.filter.maxUsers ||
			(this.filter.maxUsers &&
				this.usersProcessed.length >= this.filter.maxUsers)
		) {
			this.stop()
		}
		return true
	}

	public stop() {
		this.client.componentHandler.removeCollector(this)
	}

	private resetTimeout() {
		if (this.idleTimeout) {
			clearTimeout(this.idleTimeout)
			this.idleTimeout = setTimeout(() => {
				if (this.lastRan + this.filter.idle! < Date.now()) {
					this.stop()
				} else {
					this.resetTimeout()
				}
			}, this.filter.idle)
		}
	}
}
