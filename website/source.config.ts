import {
	defineConfig,
	defineDocs,
	frontmatterSchema
} from "fumadocs-mdx/config"
import { z } from "zod"

export const docs = defineDocs({
	dir: "content",
	docs: {
		schema: frontmatterSchema.extend({
			index: z.boolean().default(false)
		})
	}
})

export default defineConfig({
	lastModifiedTime: "git"
})
