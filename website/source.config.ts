import {
	defineConfig,
	defineDocs,
	defineCollections,
	frontmatterSchema,
	metaSchema
} from "fumadocs-mdx/config"
import { z } from "zod"

export const { docs, meta } = defineDocs({
	docs: {
		dir: "content",
		schema: frontmatterSchema.extend({
			index: z.boolean().default(false)
		})
	},
	meta: {
		dir: "content",
		schema: metaSchema
	}
})

export default defineConfig({
	generateManifest: true,
	lastModifiedTime: "git"
})
