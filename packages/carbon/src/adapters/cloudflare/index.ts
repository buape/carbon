import type { ExecutionContext } from "@cloudflare/workers-types"
import type { Handle } from "../../createHandle.js"
import {
	type HandlerOptions,
	type PartialEnv,
	patchRequest
} from "../shared.js"

export function createHandler(handle: Handle, options: HandlerOptions) {
	return (req: Request, env: PartialEnv, ctx: ExecutionContext) => {
		const fetch = handle(env)
		return fetch(patchRequest(req, options), ctx)
	}
}
