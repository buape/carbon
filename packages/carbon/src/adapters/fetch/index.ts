import type { Context, Route } from "../../abstracts/Plugin.js"
import type { Client } from "../../classes/Client.js"

export type Handler = (req: Request, ctx: Context) => Promise<Response>

/**
 * Creates a fetch handler function for the clients routes
 * @param client The client to create the handler for
 * @returns The handler function
 */
export function createHandler(client: Client): Handler {
	return async (req: Request, ctx: Context) => {
		const method = req.method
		const url = new URL(req.url, "http://localhost")
		const pathname = //
			resolveRequestPathname(new URL(client.options.baseUrl), url)
		if (!pathname) return new Response("Not Found", { status: 404 })

		const matchedRoutesByPath = //
			client.routes.filter((r) => r.path === pathname && !r.disabled)
		const matchedRoutesByMethod = //
			matchedRoutesByPath.filter((r) => r.method === method)

		if (matchedRoutesByMethod.length === 0) {
			if (matchedRoutesByPath.length > 0)
				return new Response("Method Not Allowed", { status: 405 })
			return new Response("Not Found", { status: 404 })
		}

		// Use the last matched route to allow for overriding
		const route = matchedRoutesByMethod.at(-1) as Route

		const passedSecret = url.searchParams.get("secret")
		if (route.protected && client.options.deploySecret !== passedSecret)
			return new Response("Unauthorized", { status: 401 })

		try {
			return await route.handler(req, ctx)
		} catch (error) {
			console.error(error)
			return new Response("Internal Server Error", { status: 500 })
		}
	}
}

function resolveRequestPathname(baseUrl: URL, reqUrl: URL) {
	// Need to use pathname only due to host name being different in Cloudflare Tunnel
	const basePathname = baseUrl.pathname.replace(/\/$/, "")
	const reqPathname = reqUrl.pathname.replace(/\/$/, "")
	if (!reqPathname.startsWith(basePathname)) return null
	return reqPathname.slice(basePathname.length)
}
