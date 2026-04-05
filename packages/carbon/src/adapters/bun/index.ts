import Bun from "bun"
import type { Client } from "../../index.js"
import type { ClientManager } from "../../plugins/client-manager/ClientManager.js"
import { createHandler } from "../fetch/index.js"

export type Server = ReturnType<typeof Bun.serve>

export type ServerOptions =
	| Bun.Serve.HostnamePortServeOptions<unknown>
	| Bun.Serve.UnixServeOptions<unknown>

/**
 * Creates a server for the client or client manager using Bun.serve
 * @param client The Carbon client or client manager to create the server for
 * @param options Additional options for the server
 * @returns The Bun.Server instance
 */
export function createServer(
	client: Client | ClientManager,
	options: ServerOptions
): Server {
	const fetch = createHandler(client)

	if ("unix" in options && options.unix !== undefined) {
		return Bun.serve({
			...options,
			fetch: (r) => fetch(r, {})
		})
	}

	return Bun.serve({
		...options,
		fetch: (r) => fetch(r, {})
	})
}
