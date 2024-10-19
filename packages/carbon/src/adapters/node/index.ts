import * as Hono from "@hono/node-server"
import type { Handle } from "../../createHandle.js"
import type { ServerOptions } from "../shared.js"

export type Server = ReturnType<typeof Hono.serve>

/**
 * Creates a Node.js server using the provided handle function and options
 * @param handle The handle function created by {@link createHandle}
 * @param options The server options including the port and hostname
 * @returns The created server instance
 * @example
 * ```ts
 * const server = createServer(handle, { ... })
 * ```
 */
export function createServer(handle: Handle, options: ServerOptions): Server {
	const fetch = handle(process.env)
	return Hono.serve({
		fetch: (req) => fetch(req, {}),
		port: options.port,
		hostname: options.hostname
	})
}
