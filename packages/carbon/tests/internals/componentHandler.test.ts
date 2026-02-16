import { expect, test } from "vitest"

import {
	Button,
	type Client,
	ComponentHandler,
	ComponentType,
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
