import {
	defineConfig,
	defineDocs,
	defineCollections,
	frontmatterSchema
} from "fumadocs-mdx/config"
import { z } from "zod"

export const { docs, meta } = defineDocs({
	docs: {
		dir: "content",
		schema: frontmatterSchema.extend({
			index: z.boolean().default(false)
		})
	}
})

export default defineConfig({
	generateManifest: true,
	lastModifiedTime: "git"
})
