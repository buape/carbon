import { serve as honoServe } from "@hono/node-server"
import type { Client } from "@buape/carbon"

export const serve = (client: Client, options: { port: number }) => {
	console.log(`Serving client on port ${options.port}`)
	honoServe({ fetch: client.router.fetch, port: options.port })
}
