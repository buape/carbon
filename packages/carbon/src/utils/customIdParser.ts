import type { ComponentParserResult } from "../types/index.js"

export const parseCustomId = (id: string): ComponentParserResult => {
	const [key, rawData] = id.split(":")
	if (!key) throw new Error(`Invalid component ID: ${id}`)
	return {
		key,
		data: Object.fromEntries(
			(rawData ?? "").split(";").map((d) => {
				const [k, v] = d.split("=")
				if (v === "true") return [k, true]
				if (v === "false") return [k, false]
				return [k, Number.isNaN(Number(v)) ? v : Number(v)]
			})
		)
	}
}
