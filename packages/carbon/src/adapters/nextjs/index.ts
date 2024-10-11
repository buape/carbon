import type { Handle } from "../../createHandle.js"
import type { HandlerOptions } from "../shared.js"

export type Handler = (req: Request) => Promise<Response>

/**
 * Creates a Next.js handler function using the provided handle and handler options
 * @param handle - The handle function to process requests
 * @param options - The handler options including any necessary configurations
 * @returns The created handler function
 * @example
 * ```ts
 * const handler = createHandler(handle, { ... })
 * export { handler as GET, handler as POST }
 * ```
 */
export function createHandler(
	handle: Handle,
	_options?: HandlerOptions
): Handler {
	return (req: Request) => {
		const fetch = handle(process.env)
		return fetch(req)
	}
}