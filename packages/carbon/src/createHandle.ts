import type { Context, Plugin } from "./abstracts/Plugin.js"
import type { PartialEnv } from "./adapters/shared.js"

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
export function createHandle(factory: (env: PartialEnv) => Plugin[]) {
	return (env: PartialEnv) => {
		const plugins = factory(env)
		const routes = plugins.flatMap((plugin) => plugin.routes)

		return async (req: Request, ctx?: Context) => {
			let routeMatched = false
			for (const route of routes) {
				if (route.path !== new URL(req.url).pathname) continue
				routeMatched = true
				if (route.method !== req.method) continue
				return await route.handler(req, ctx)
			}

			if (routeMatched) return new Response(null, { status: 405 })
			return new Response(null, { status: 404 })
		}
	}
}

export type Handle = ReturnType<typeof createHandle>
export type Fetch = ReturnType<Handle>
