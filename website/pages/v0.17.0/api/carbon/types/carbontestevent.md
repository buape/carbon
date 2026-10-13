---
title: CarbonTestEvent
hidden: true
---

## Signature

```ts
type CarbonTestEvent = | {
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
			interactionId: InteractionId
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
```

