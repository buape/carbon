import type { ExecutionContext, Request } from "@cloudflare/workers-types"

declare global {
	namespace NodeJS {
		interface ProcessEnv extends Record<string, string | undefined> {}
		interface Process {
			env: ProcessEnv
		}
	}
	var process: NodeJS.Process
}

export default {
	async fetch(req: Request, env: NodeJS.ProcessEnv, ctx: ExecutionContext) {
		Reflect.set(globalThis, "process", { env })
		const mod = await import("./index.js")
		return mod.default.fetch(req, ctx)
	}
}
