import type { ExecutionContext } from "@cloudflare/workers-types"
import type { Handle } from "../../createHandle.js"
import {
	type HandlerOptions,
	type PartialEnv,
	patchRequest
} from "../shared.js"

export type Handler = (
	req: Request,
	env: PartialEnv,
	ctx: ExecutionContext
) => Promise<Response>

/**
 * Creates a Cloudflare handler function using the provided handle and handler options
 * @param handle - The handle function to process requests
 * @param options - The handler options including any necessary configurations
 * @returns The created handler function
 * @example
 * ```ts
 * const handler = createHandler(handle, { ... })
 * export default { fetch: handler }
 * ```
 */
export function createHandler(
	handle: Handle,
	options: HandlerOptions
): Handler {
	return (req: Request, env: PartialEnv, ctx: ExecutionContext) => {
		const fetch = handle(env)
		return fetch(patchRequest(req, options), ctx)
	}
}
