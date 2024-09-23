import { dirname, relative, sep } from "node:path"
// @ts-check
import { fileURLToPath } from "node:url"
import { MarkdownPageEvent } from "typedoc-plugin-markdown"

/**
 * @param {import('typedoc-plugin-markdown').MarkdownApplication} app
 */
export function load(app) {
	const root = fileURLToPath(new URL("./", import.meta.url))

	// Set "title" frontmatter for each page
	app.renderer.on(
		MarkdownPageEvent.BEGIN,
		/** @param {import('typedoc-plugin-markdown').MarkdownPageEvent} page */
		(page) => {
			page.frontmatter = {
				title: page.model.name
			}
		}
	)

	// Resolve all Markdown links to root relative
	app.renderer.on(
		MarkdownPageEvent.END,
		/** @param {import('typedoc-plugin-markdown').MarkdownPageEvent} page */
		(page) => {
			if (!page.contents) return
			const rel = relative(root, dirname(page.filename))
			const parts = rel.split(sep)
			const pkg = parts[1]
			const dirParts = parts.slice(3)
			const dir = dirParts.length ? `${dirParts.join("/")}/` : ""
			page.contents = page.contents.replace(
				/(?<!\\)\[(.*?)]\((.*?)\)/g,
				(_, text, link) => {
					let newLink = link
					if (!link.includes("://")) {
						const url = new URL(link, `http://e.com/${pkg}/api/${dir}`)
						newLink = `${url.pathname}${url.search}${url.hash}`
						if (link.endsWith("/index")) {
							newLink = link.slice(0, -6)
						}
					}
					return `[${text}](${newLink})`
				}
			)
		}
	)

	// Remove ".mdx" from the file extension for each link on every page
	app.renderer.on(
		MarkdownPageEvent.END,
		/** @param {import('typedoc-plugin-markdown').MarkdownPageEvent} page */
		(page) => {
			if (!page.contents) return
			page.contents = page.contents.replace(/\.mdx/g, "")
		}
	)
}
