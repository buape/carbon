import Bun from "bun"
import type { Handle } from "../../createHandle.js"
import { type ServerOptions, patchRequest } from "../shared.js"

export function createServer(handle: Handle, options: ServerOptions) {
	const fetch = handle(process.env)
	return Bun.serve({
		fetch: (r) => fetch(patchRequest(r, options), {}),
		port: options.port,
		hostname: options.hostname
	})
}
