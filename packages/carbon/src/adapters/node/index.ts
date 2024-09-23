import type { Handle } from "../../createHandle.js"
import { patchRequest, type ServerOptions } from "../shared.js"
import * as Hono from "@hono/node-server"

export function createServer(handle: Handle, options: ServerOptions) {
	const fetch = handle(process.env)
	return Hono.serve({
		fetch: (r) => fetch(patchRequest(r, options), {}),
		port: options.port,
		hostname: options.hostname,
	})
}
