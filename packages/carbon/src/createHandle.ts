import type { Context, Plugin, Route } from "./abstracts/Plugin.js"
import type { PartialEnv } from "./adapters/shared.js"
import type { Client } from "./classes/Client.js"

/**
 * Creates a handle function that can be used to handle requests
 * @param factory The factory function that creates the plugins
 * @returns The handle function
 * @example
 * ```ts
 * const handle = createHandle((env) => {
 *  const client = new Client({ ... }, [ ... ])
 *  const linkedRoles = new LinkedRoles(client, { ... })
 *  return [client, linkedRoles]
 * })
 * ```
 */
export function createHandle<Env extends PartialEnv = PartialEnv>(
	factory: (env: Env) => [Client, ...Plugin[]]
) {
	return (env: Env) => {
		const [client, ...plugins] = factory(env)
		const routes = [client, ...plugins].flatMap((plugin) => plugin.routes)

		return async (req: Request, ctx?: Context) => {
			const method = req.method
			const url = new URL(req.url)
			const pathname = //
				resolveRequestPathname(new URL(client.options.baseUrl), url)
			if (!pathname) return new Response("Not Found", { status: 404 })

			const matchedRoutesByPath = //
				routes.filter((r) => r.path === pathname && !r.disabled)
			const matchedRoutesByMethod = //
				matchedRoutesByPath.filter((r) => r.method === method)

			if (matchedRoutesByMethod.length === 0) {
				if (matchedRoutesByPath.length > 0)
					return new Response("Method Not Allowed", { status: 405 })
				return new Response("Not Found", { status: 404 })
			}

			// Use the last matched route by method to allow for overriding
			const route = matchedRoutesByMethod.at(-1) as Route

			const passedSecret = url.searchParams.get("secret")
			if (route.protected && client.options.clientSecret !== passedSecret)
				return new Response("Unauthorized", { status: 401 })

			try {
				return await route.handler(req, ctx)
			} catch (error) {
				console.error(error)
				return new Response("Internal Server Error", { status: 500 })
			}
		}
	}
}

function resolveRequestPathname(baseUrl: URL, reqUrl: URL) {
	const cleanBaseUrl = `${baseUrl.host}${baseUrl.pathname}`.replace(/\/$/, "")
	const cleanReqUrl = `${reqUrl.host}${reqUrl.pathname}`.replace(/\/$/, "")
	if (!cleanReqUrl.startsWith(cleanBaseUrl)) return null
	return cleanReqUrl.slice(cleanBaseUrl.length)
}

export type Handle = ReturnType<typeof createHandle>
export type Fetch = ReturnType<Handle>
