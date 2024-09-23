import type { Handle } from "../../createHandle.js"
import { patchRequest, type ServerOptions } from "../shared.js"
import Bun from "bun"

export function createServer(handle: Handle, options: ServerOptions) {
	const fetch = handle(process.env)
	return Bun.serve({
		fetch: (r) => fetch(patchRequest(r, options), {}),
		port: options.port,
		hostname: options.hostname
	})
}
