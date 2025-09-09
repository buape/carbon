import fs from "node:fs"
import path from "node:path"
import type { DocsLayoutProps } from "fumadocs-ui/layouts/docs"
import {
	API_TYPES,
	type TypeDocNode,
	collectItemsByKind,
	collectModulesByPath,
	getKindString
} from "./api-constants"

function generateApiTree(): DocsLayoutProps["tree"] {
	try {
		// Read the API data from the public directory
		const apiDataPath = path.join(process.cwd(), "public", "api.json")

		if (!fs.existsSync(apiDataPath)) {
			console.warn("API data not found, using fallback tree")
			return {
				name: "API Documentation",
				children: [
					{
						type: "page",
						name: "Overview",
						url: "/api",
						external: false
					}
				]
			}
		}

		const apiDataRaw = fs.readFileSync(apiDataPath, "utf-8")
		const apiData: TypeDocNode = JSON.parse(apiDataRaw)

		const children: DocsLayoutProps["tree"]["children"] = [
			{
				type: "page",
				name: "Overview",
				url: "/api",
				external: false
			}
		]

		// Generate folders for each API type
		for (const [typeKey, config] of Object.entries(API_TYPES)) {
			let items: TypeDocNode[] = []

			if (config.filter) {
				// For kinds like Class, Function, Interface, TypeAlias
				items = collectItemsByKind(apiData, config.filter)
			} else {
				// For modules like adapters/plugins
				const pathPrefix = typeKey === "adapter" ? "adapters/" : "plugins/"
				items = collectModulesByPath(apiData, pathPrefix)
			}

			if (items.length > 0) {
				// Sort items alphabetically
				items.sort((a, b) => {
					const nameA = a.name.split("/").pop() || a.name
					const nameB = b.name.split("/").pop() || b.name
					return nameA.localeCompare(nameB)
				})

				children.push({
					type: "folder",
					name: config.title,
					index: {
						type: "page",
						name: config.title,
						url: `/api/${typeKey}`,
						external: false
					},
					children: items.map((item) => {
						const name = item.name.split("/").pop() || item.name
						return {
							type: "page",
							name: name,
							url: `/api/${typeKey}/${name.toLowerCase()}`,
							external: false
						}
					})
				})
			}
		}

		return {
			name: "API Documentation",
			children
		}
	} catch (error) {
		console.error("Error generating API tree:", error)
		return {
			name: "API Documentation",
			children: [
				{
					type: "page",
					name: "Overview",
					url: "/api",
					external: false
				}
			]
		}
	}
}

export const apiPageTree = generateApiTree()
