import {
	defineConfig,
	defineDocs,
	frontmatterSchema,
	metaSchema
} from "fumadocs-mdx/config"
import { z } from "zod"

export const { docs, meta } = defineDocs({
	dir: "content",
	docs: {
		schema: frontmatterSchema.extend({
			index: z.boolean().default(false)
		})
	},
	meta: {
		schema: metaSchema
	}
})

export default defineConfig({
	lastModifiedTime: "git"
})
