import type {
	DiscordCall,
	InteractionRunResult,
	RecordedResponse
} from "../types.js"

const getData = (response: RecordedResponse | undefined) => {
	const body = response?.body as { data?: unknown } | undefined
	return body && "data" in body ? body.data : body
}

const matches = (actual: unknown, expected: unknown): boolean => {
	if (expected === undefined) return true
	if (Object.is(actual, expected)) return true
	if (
		!actual ||
		!expected ||
		typeof actual !== "object" ||
		typeof expected !== "object"
	)
		return false
	if (Array.isArray(expected))
		return (
			Array.isArray(actual) &&
			expected.every((value, index) => matches(actual[index], value))
		)
	return Object.entries(expected).every(([key, value]) =>
		matches((actual as Record<string, unknown>)[key], value)
	)
}

const format = (value: unknown) => JSON.stringify(value, null, 2)

export function assertReply(result: InteractionRunResult, expected?: unknown) {
	const actual = getData(result.reply)
	const pass = matches(actual, expected)
	return {
		pass,
		message: pass
			? "Expected interaction not to have replied with matching data"
			: `Expected reply to match ${format(expected)}, received ${format(actual)}`
	}
}

export function assertDeferred(result: InteractionRunResult) {
	return {
		pass: result.deferred,
		message: result.deferred
			? "Expected interaction not to be deferred"
			: "Expected interaction to be deferred"
	}
}

export function assertResponse(
	result: InteractionRunResult,
	kind: string,
	expected?: unknown
) {
	const response = result.responses.find((item) => item.kind === kind)
	const actual = getData(response)
	const pass = Boolean(response) && matches(actual, expected)
	return {
		pass,
		message: pass
			? `Expected no ${kind} response`
			: `Expected ${kind} response to match ${format(expected)}, received ${format(actual)}`
	}
}

export function assertDiscordCall(
	calls: DiscordCall[],
	method: string,
	path: string | RegExp,
	expectedBody?: unknown
) {
	const call = calls.find((candidate) => {
		if (candidate.method !== method.toUpperCase()) return false
		if (typeof path === "string" && candidate.path !== path) return false
		if (path instanceof RegExp && !path.test(candidate.path)) return false
		return expectedBody === undefined || matches(candidate.body, expectedBody)
	})
	return {
		pass: Boolean(call),
		message: call
			? `Expected not to call ${method} ${String(path)}`
			: `Expected Discord call ${method} ${String(path)}`
	}
}

export function expectReply(result: InteractionRunResult, expected?: unknown) {
	const assertion = assertReply(result, expected)
	if (!assertion.pass) throw new Error(assertion.message)
}

export function expectDeferred(result: InteractionRunResult) {
	const assertion = assertDeferred(result)
	if (!assertion.pass) throw new Error(assertion.message)
}

export function expectResponse(
	result: InteractionRunResult,
	kind: string,
	expected?: unknown
) {
	const assertion = assertResponse(result, kind, expected)
	if (!assertion.pass) throw new Error(assertion.message)
}

export function expectDiscordCall(
	calls: DiscordCall[],
	method: string,
	path: string | RegExp,
	expectedBody?: unknown
) {
	const assertion = assertDiscordCall(calls, method, path, expectedBody)
	if (!assertion.pass) throw new Error(assertion.message)
}
