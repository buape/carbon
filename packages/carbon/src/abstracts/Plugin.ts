export abstract class Plugin {
	routes: Route[] = []
}

export interface Route {
	method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
	path: `/${string}`
	handler(req: Request, ctx?: Context): Response | Promise<Response>
}

export interface Context {
	// biome-ignore lint/suspicious/noExplicitAny: true any
	waitUntil?(promise: Promise<any>): void
}
