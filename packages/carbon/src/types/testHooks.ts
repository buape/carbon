import type { QueuedRequest } from "../classes/RequestClient.js"

export type CarbonFetch = (
	input: string | URL | Request,
	init?: RequestInit
) => Promise<Response>

export type CarbonTestEvent =
	| {
			type: "rest:request"
			method: string
			path: string
			url: string
			body?: unknown
			query?: QueuedRequest["query"]
	  }
	| {
			type: "interaction:response"
			kind:
				| "reply"
				| "defer"
				| "edit-original"
				| "followup"
				| "modal"
				| "autocomplete"
				| "acknowledge"
				| "update"
			interactionId: string
			body: unknown
	  }
	| {
			type: "handler:error"
			handler: "command" | "autocomplete" | "component" | "modal" | "event"
			error: unknown
	  }
	| {
			type: "component:registered"
			customId: string
			componentType: number
	  }
	| {
			type: "modal:registered"
			customId: string
	  }

export type CarbonTestHooks = {
	emit?: (event: CarbonTestEvent) => void
	throwHandlerErrors?: boolean
}

export type CarbonTestHookDisposer = () => void
