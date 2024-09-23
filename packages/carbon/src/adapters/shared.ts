export type PartialEnv = Record<string, string | undefined>

export interface SharedOptions {
	relativePath?: `/${string}`
}

export interface ServerOptions extends SharedOptions {
	port: number
	hostname?: string
}

export interface HandlerOptions extends SharedOptions {}

export function patchRequest(req: Request, options: SharedOptions) {
	const clone = req.clone()

	if (options.relativePath) {
		// This is quite a hacky way to do this, but i can't think of a better way
		const url = new URL(clone.url)
		const isRelative = url.pathname.startsWith(options.relativePath)
		if (!isRelative) url.pathname = "/404"
		else url.pathname = url.pathname.replace(options.relativePath, "")
		Object.defineProperty(clone, "url", { get: () => url.toString() })
	}

	return clone
}
