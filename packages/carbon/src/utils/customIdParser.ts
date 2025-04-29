import type { ComponentParserResult } from "../types/index.js"

export function parseCustomId(id: string): ComponentParserResult {
	const [key, ...data] = id.split(":")
	if (!key) throw new Error(`Invalid component ID: ${id}`)
	return {
		key,
		data: Object.fromEntries(
			data.map((d) => {
				const [k, v] = d.split("=")
				if (v === "true") return [k, true]
				if (v === "false") return [k, false]
				return [k, Number.isNaN(Number(v)) ? v : Number(v)]
			})
		)
	}
}
