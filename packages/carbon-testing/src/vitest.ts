import { expect } from "vitest"
import {
	assertDeferred,
	assertDiscordCall,
	assertReply,
	assertResponse
} from "./assertions/core.js"
import type { DiscordCall, InteractionRunResult } from "./types.js"

declare module "vitest" {
	interface Assertion<T> {
		toHaveRepliedWith(expected?: unknown): T
		toHaveDeferred(): T
		toHaveInteractionResponse(kind: string, expected?: unknown): T
		toHaveDiscordCall(
			method: string,
			path: string | RegExp,
			expectedBody?: unknown
		): T
	}
}

export const carbonMatchers = {
	toHaveRepliedWith(result: InteractionRunResult, expected?: unknown) {
		const assertion = assertReply(result, expected)
		return { pass: assertion.pass, message: () => assertion.message }
	},
	toHaveDeferred(result: InteractionRunResult) {
		const assertion = assertDeferred(result)
		return { pass: assertion.pass, message: () => assertion.message }
	},
	toHaveInteractionResponse(
		result: InteractionRunResult,
		kind: string,
		expected?: unknown
	) {
		const assertion = assertResponse(result, kind, expected)
		return { pass: assertion.pass, message: () => assertion.message }
	},
	toHaveDiscordCall(
		calls: DiscordCall[] | { calls: DiscordCall[] },
		method: string,
		path: string | RegExp,
		expectedBody?: unknown
	) {
		const assertion = assertDiscordCall(
			Array.isArray(calls) ? calls : calls.calls,
			method,
			path,
			expectedBody
		)
		return { pass: assertion.pass, message: () => assertion.message }
	}
}

expect.extend(carbonMatchers)

export {
	expectDeferred,
	expectDiscordCall,
	expectReply,
	expectResponse
} from "./assertions/core.js"
