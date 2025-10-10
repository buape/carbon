import Bun from "bun"
import type { Client } from "../../index.js"
import type { ClientManager } from "../../plugins/client-manager/ClientManager.js"
import { createHandler } from "../fetch/index.js"

export type Server = Bun.Server
export type ServerOptions = Omit<Bun.ServeOptions, "fetch">

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
	return Bun.serve({
		...options,
		fetch: (r) => fetch(r, {})
	})
}
