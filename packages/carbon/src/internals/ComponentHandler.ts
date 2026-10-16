import {
	type APIMessageComponentButtonInteraction,
	type APIMessageComponentInteraction,
	type APIMessageComponentInteractionData,
	type APIMessageComponentSelectMenuInteraction,
	ComponentType,
	InteractionResponseType,
	type RESTPostAPIInteractionCallbackJSONBody,
	Routes
} from "discord-api-types/v10"
import { Base } from "../abstracts/Base.js"
import type { BaseComponentInteraction } from "../abstracts/BaseComponentInteraction.js"
import type { BaseMessageInteractiveComponent } from "../abstracts/BaseMessageInteractiveComponent.js"
import { Button } from "../classes/components/Button.js"
import { ChannelSelectMenu } from "../classes/components/ChannelSelectMenu.js"
import { MentionableSelectMenu } from "../classes/components/MentionableSelectMenu.js"
import { RoleSelectMenu } from "../classes/components/RoleSelectMenu.js"
import { StringSelectMenu } from "../classes/components/StringSelectMenu.js"
import { UserSelectMenu } from "../classes/components/UserSelectMenu.js"
import { LRUCache } from "../utils/LRUCache.js"
import { defaultLogger } from "../utils/logger.js"
import { ButtonInteraction } from "./ButtonInteraction.js"
import { ChannelSelectMenuInteraction } from "./ChannelSelectMenuInteraction.js"
import { MentionableSelectMenuInteraction } from "./MentionableSelectMenuInteraction.js"
import { RoleSelectMenuInteraction } from "./RoleSelectMenuInteraction.js"
import { StringSelectMenuInteraction } from "./StringSelectMenuInteraction.js"
import { UserSelectMenuInteraction } from "./UserSelectMenuInteraction.js"

const messageComponentTypes = [
	ComponentType.Button,
	ComponentType.StringSelect,
	ComponentType.UserSelect,
	ComponentType.RoleSelect,
	ComponentType.MentionableSelect,
	ComponentType.ChannelSelect
] as const satisfies readonly ComponentType[]

export class ComponentHandler extends Base {
	private componentCache = new LRUCache<
		string,
		BaseMessageInteractiveComponent
	>(10000)
	private componentParsersByType = new Map<
		ComponentType,
		Set<BaseMessageInteractiveComponent["customIdParser"]>
	>()

	oneOffComponents: Map<
		`${string}-${string}`,
		{
			resolve: (data: APIMessageComponentInteractionData) => void
		}
	> = new Map()

	private getComponentCacheKey(
		key: string,
		componentType: ComponentType
	): string {
		return `${componentType}:${key}`
	}

	registerComponent(component: BaseMessageInteractiveComponent) {
		const componentKey = component.customIdParser(component.customId).key
		const cacheKey = this.getComponentCacheKey(componentKey, component.type)
		const parsers = this.componentParsersByType.get(component.type) ?? new Set()
		parsers.add(component.customIdParser)
		this.componentParsersByType.set(component.type, parsers)
		if (!this.componentCache.has(cacheKey)) {
			this.componentCache.set(cacheKey, component)
			this.client.options?.testHooks?.emit?.({
				type: "component:registered",
				customId: component.customId,
				componentType: component.type
			})
		}
	}

	hasComponentWithKey(key: string, componentType?: ComponentType): boolean {
		if (componentType !== undefined) {
			return this.componentCache.has(
				this.getComponentCacheKey(key, componentType)
			)
		}

		return messageComponentTypes.some((type) =>
			this.componentCache.has(this.getComponentCacheKey(key, type))
		)
	}

	findComponent(
		customId: string,
		componentType: ComponentType
	): BaseMessageInteractiveComponent | undefined {
		const parsers = this.componentParsersByType.get(componentType)
		if (parsers) {
			for (const parser of parsers) {
				const interactionKey = parser(customId).key
				const exactComponent = this.componentCache.get(
					this.getComponentCacheKey(interactionKey, componentType)
				)
				if (exactComponent?.customIdParser === parser) return exactComponent
			}
		}

		return this.componentCache.get(
			this.getComponentCacheKey("*", componentType)
		)
	}

	private async runComponent(
		component: BaseMessageInteractiveComponent,
		interaction: BaseComponentInteraction,
		parsed: ReturnType<BaseMessageInteractiveComponent["customIdParser"]>
	): Promise<void> {
		if ((await component.preCheck(interaction, parsed.data)) !== true) return

		if (typeof component.ephemeral === "function") {
			interaction.setDefaultEphemeral(component.ephemeral(interaction))
		}

		const shouldDefer =
			typeof component.defer === "function"
				? component.defer(interaction)
				: component.defer

		if (shouldDefer) await interaction.defer()
		await component.run(interaction, parsed.data)
	}
	async handleInteraction(data: APIMessageComponentInteraction) {
		return this.client.instrumentation
			? await this.client.instrumentation.run(
					"discord.interaction.component",
					{ "discord.component.type": data.data.component_type },
					() => this.handleInteractionInternal(data)
				)
			: await this.handleInteractionInternal(data)
	}

	private async handleInteractionInternal(
		data: APIMessageComponentInteraction
	) {
		try {
			const oneOffComponent = this.oneOffComponents.get(
				`${data.message.id}-${data.message.channel_id}`
			)

			if (oneOffComponent) {
				oneOffComponent.resolve(data.data)
				this.oneOffComponents.delete(
					`${data.message.id}-${data.message.channel_id}`
				)
				await this.client.rest
					.post(Routes.interactionCallback(data.id, data.token), {
						body: {
							type: InteractionResponseType.DeferredMessageUpdate
						} as RESTPostAPIInteractionCallbackJSONBody
					})
					.catch(() => {
						this.client.logger.warn(
							`Failed to acknowledge one-off component interaction for message ${data.message.id}`
						)
					})
				return
			}

			const component = this.findComponent(
				data.data.custom_id,
				data.data.component_type
			)

			if (!component) {
				throw new Error(
					`Unknown component with type ${data.data.component_type} and custom ID ${data.data.custom_id} was received, did you forget to register the component? See https://carbon.buape.com/concepts/component-registration for more information.`
				)
			}

			const parsed = component.customIdParser(data.data.custom_id)
			const interactionOptions = {
				ephemeral:
					typeof component.ephemeral === "function"
						? false
						: component.ephemeral
			}

			if (component instanceof Button) {
				await this.runComponent(
					component,
					new ButtonInteraction(
						this.client,
						data as APIMessageComponentButtonInteraction,
						interactionOptions
					),
					parsed
				)
			} else if (component instanceof RoleSelectMenu) {
				await this.runComponent(
					component,
					new RoleSelectMenuInteraction(
						this.client,
						data as APIMessageComponentSelectMenuInteraction,
						interactionOptions
					),
					parsed
				)
			} else if (component instanceof ChannelSelectMenu) {
				await this.runComponent(
					component,
					new ChannelSelectMenuInteraction(
						this.client,
						data as APIMessageComponentSelectMenuInteraction,
						interactionOptions
					),
					parsed
				)
			} else if (component instanceof MentionableSelectMenu) {
				await this.runComponent(
					component,
					new MentionableSelectMenuInteraction(
						this.client,
						data as APIMessageComponentSelectMenuInteraction,
						interactionOptions
					),
					parsed
				)
			} else if (component instanceof StringSelectMenu) {
				await this.runComponent(
					component,
					new StringSelectMenuInteraction(
						this.client,
						data as APIMessageComponentSelectMenuInteraction,
						interactionOptions
					),
					parsed
				)
			} else if (component instanceof UserSelectMenu) {
				await this.runComponent(
					component,
					new UserSelectMenuInteraction(
						this.client,
						data as APIMessageComponentSelectMenuInteraction,
						interactionOptions
					),
					parsed
				)
			} else {
				throw new Error(
					`Unknown component with type ${data.data.component_type} and custom ID ${data.data.custom_id}`
				)
			}
		} catch (error: unknown) {
			this.client.instrumentation?.emit("carbon.interaction.handler.error", {
				handler: "component"
			})
			this.client.options?.testHooks?.emit?.({
				type: "handler:error",
				handler: "component",
				error
			})
			if (this.client.options?.testHooks?.throwHandlerErrors === false) {
				;(this.client.logger ?? defaultLogger).error(error)
				return
			}
			throw error
		}
	}
}
