import { expect, test, vi } from "vitest"

import {
	type APIMessageComponentInteraction,
	type APIModalSubmitInteraction,
	Button,
	type Client,
	ComponentHandler,
	ComponentType,
	InteractionType,
	Modal,
	ModalHandler,
	StringSelectMenu
} from "../../src/index.js"

class WildcardButton extends Button {
	customId = "*"
	label = "Any"
}

class WildcardSelectMenu extends StringSelectMenu {
	customId = "*"
	options = [
		{
			label: "Option",
			value: "option"
		}
	]
}

class ThrowingButton extends Button {
	customId = "throwing-button"
	label = "Throw"

	run() {
		throw new Error("component failed")
	}
}

class ThrowingModal extends Modal {
	customId = "throwing-modal"
	title = "Throw"

	run() {
		throw new Error("modal failed")
	}
}

test("registers wildcard components per type", () => {
	const handler = new ComponentHandler({} as Client)
	const button = new WildcardButton()
	const selectMenu = new WildcardSelectMenu()

	handler.registerComponent(button)
	handler.registerComponent(selectMenu)

	const matchedButton = handler.findComponent("anything", ComponentType.Button)
	const matchedSelect = handler.findComponent(
		"anything",
		ComponentType.StringSelect
	)

	expect(matchedButton).toBeInstanceOf(WildcardButton)
	expect(matchedSelect).toBeInstanceOf(WildcardSelectMenu)
})

test("hasComponentWithKey respects component type", () => {
	const handler = new ComponentHandler({} as Client)
	handler.registerComponent(new WildcardButton())
	handler.registerComponent(new WildcardSelectMenu())

	expect(handler.hasComponentWithKey("*", ComponentType.Button)).toBe(true)
	expect(handler.hasComponentWithKey("*", ComponentType.StringSelect)).toBe(
		true
	)
	expect(handler.hasComponentWithKey("*", ComponentType.RoleSelect)).toBe(false)
})

test("component handler records and swallows errors when test hooks disable rethrow", async () => {
	const events: unknown[] = []
	const client = {
		options: {
			testHooks: {
				throwHandlerErrors: false,
				emit: (event: unknown) => events.push(event)
			}
		}
	} as Client
	const handler = new ComponentHandler(client)
	handler.registerComponent(new ThrowingButton())
	const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {})

	try {
		await expect(
			handler.handleInteraction({
				id: "1",
				token: "token",
				type: InteractionType.MessageComponent,
				data: {
					custom_id: "throwing-button",
					component_type: ComponentType.Button
				},
				message: {
					id: "2",
					channel_id: "3"
				}
			} as APIMessageComponentInteraction)
		).resolves.toBeUndefined()
	} finally {
		errorSpy.mockRestore()
	}

	expect(events).toContainEqual({
		type: "handler:error",
		handler: "component",
		error: expect.any(Error)
	})
})

test("modal handler records and swallows errors when test hooks disable rethrow", async () => {
	const events: unknown[] = []
	const client = {
		options: {
			testHooks: {
				throwHandlerErrors: false,
				emit: (event: unknown) => events.push(event)
			}
		}
	} as Client
	const handler = new ModalHandler(client)
	handler.registerModal(new ThrowingModal())
	const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {})

	try {
		await expect(
			handler.handleInteraction({
				id: "1",
				token: "token",
				type: InteractionType.ModalSubmit,
				data: {
					custom_id: "throwing-modal",
					components: []
				}
			} as APIModalSubmitInteraction)
		).resolves.toBeUndefined()
	} finally {
		errorSpy.mockRestore()
	}

	expect(events).toContainEqual({
		type: "handler:error",
		handler: "modal",
		error: expect.any(Error)
	})
})
