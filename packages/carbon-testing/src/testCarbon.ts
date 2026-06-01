import type { Client } from "@buape/carbon"
import { FakeDiscord } from "./fakeDiscord.js"
import { InteractionTestRunner } from "./interactionRunner.js"
import { CarbonTestRecorder } from "./recorder.js"
import type { TestCarbonOptions } from "./types.js"

export function testCarbon(client: Client, options: TestCarbonOptions = {}) {
	const discord = new FakeDiscord(options.strict ?? true)
	const recorder = new CarbonTestRecorder(options.throwHandlerErrors ?? true)
	let disposeHooks = client.useTestHooks(recorder.hooks)
	let disposeFetch = client.useDiscordFetch(discord.fetch)

	const reset = () => {
		recorder.reset()
		discord.reset()
	}

	const dispose = () => {
		disposeFetch()
		disposeHooks()
	}

	const reattach = () => {
		dispose()
		disposeHooks = client.useTestHooks(recorder.hooks)
		disposeFetch = client.useDiscordFetch(discord.fetch)
	}

	return {
		client,
		discord,
		recorder,
		interactions: new InteractionTestRunner(client, discord, recorder),
		reset,
		dispose,
		reattach
	}
}

export type CarbonTestHarness = ReturnType<typeof testCarbon>
