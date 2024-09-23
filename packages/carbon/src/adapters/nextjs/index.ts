import type { Handle } from "../../createHandle.js"
import { type HandlerOptions, patchRequest } from "../shared.js"

export function createHandler(handle: Handle, options: HandlerOptions) {
	return (req: Request) => {
		const fetch = handle(process.env)
		return fetch(patchRequest(req, options))
	}
}
