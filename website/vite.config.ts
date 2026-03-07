import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { cloudflare } from "@cloudflare/vite-plugin"
import mdx from "@mdx-js/rollup"
import react from "@vitejs/plugin-react"
import rehypeSlug from "rehype-slug"
import remarkFrontmatter from "remark-frontmatter"
import remarkGfm from "remark-gfm"
import remarkMdxFrontmatter from "remark-mdx-frontmatter"
import { defineConfig } from "vite"

const rootDir = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
	plugins: [
		mdx({
			providerImportSource: "@mdx-js/react",
			remarkPlugins: [
				remarkFrontmatter,
				[remarkMdxFrontmatter, { name: "frontmatter" }],
				remarkGfm
			],
			rehypePlugins: [rehypeSlug]
		}),
		react(),
		cloudflare()
	],
	resolve: {
		alias: [
			{ find: "@", replacement: resolve(rootDir, "src") },
			{ find: "~", replacement: resolve(rootDir, ".") },
			{
				find: "fumadocs-ui",
				replacement: resolve(rootDir, "src/fumadocs-ui")
			},
			{
				find: /^lucide-react$/,
				replacement: resolve(rootDir, "src/lucide-react.tsx")
			}
		]
	},
	server: {
		allowedHosts: ["vite.shadowing.dev", "carbon.buape.com"]
	}
})
