import type { Client } from "../classes/Client.js"

/**
 * The base class for all plugins
 */
export abstract class Plugin {
	/**
	 * An ID that identifies the plugin uniquely between all other used plugins in the Client
	 */
	protected abstract id: string
	/**
	 * Registers the client with this plugin
	 * @param client The client to register
	 */
	registerClient?(client: Client): Promise<void> | void

	/**
	 * Registers the routes of this plugin with the client
	 * @param client The client to register the routes with
	 */
	registerRoutes?(client: Client): Promise<void> | void
}

export interface Route {
	/**
	 * The HTTP method of the route
	 */
	method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

	/**
	 * The relative path of the route
	 */
	path: `/${string}`

	/**
	 * The handler function for the route
	 * @param req The request object
	 * @param ctx The context object
	 * @returns The response object or a promise that resolves to a response object
	 */
	handler(req: Request, ctx?: Context): Response | Promise<Response>

	/**
	 * Whether this route requires authentication
	 */
	protected?: boolean

	/**
	 * Whether this route is disabled
	 */
	disabled?: boolean
}

export interface Context {
	// biome-ignore lint/suspicious/noExplicitAny: true any
	waitUntil?(promise: Promise<any>): void
}
