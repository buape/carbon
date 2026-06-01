import type { CarbonTestEvent, CarbonTestHooks } from "@buape/carbon"
import type { DiscordCall, RecordedResponse } from "./types.js"

export class CarbonTestRecorder {
	readonly events: CarbonTestEvent[] = []
	readonly errors: unknown[] = []

	constructor(readonly throwHandlerErrors = true) {}

	get hooks(): CarbonTestHooks {
		return {
			throwHandlerErrors: this.throwHandlerErrors,
			emit: (event) => {
				this.events.push(event)
				if (event.type === "handler:error") this.errors.push(event.error)
			}
		}
	}

	reset() {
		this.events.length = 0
		this.errors.length = 0
	}

	responsesSince(index: number): RecordedResponse[] {
		return this.events
			.slice(index)
			.filter((event) => event.type === "interaction:response")
			.map((event) => ({
				kind: event.kind,
				interactionId: event.interactionId,
				body: event.body
			}))
	}

	callsSince(index: number): DiscordCall[] {
		return this.events
			.slice(index)
			.filter((event) => event.type === "rest:request")
			.map((event) => ({
				method: event.method,
				path: event.path,
				url: event.url,
				query: new URL(event.url).searchParams,
				body: event.body,
				headers: new Headers()
			}))
	}
}

export const createCarbonTestRecorder = (throwHandlerErrors = true) =>
	new CarbonTestRecorder(throwHandlerErrors)
