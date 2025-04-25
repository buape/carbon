import * as fs from "node:fs/promises"
import { remarkInclude } from "fumadocs-mdx/config"
import matter from "gray-matter"
import { remark } from "remark"
import remarkGfm from "remark-gfm"
import remarkMdx from "remark-mdx"
import remarkStringify from "remark-stringify"

export const revalidate = false

const processor = remark()
	.use(remarkMdx)
	.use(remarkInclude)
	.use(remarkGfm)
	.use(remarkStringify)

export const getTxt = async (filePaths: string[]) => {
	const scan = filePaths.map(async (file) => {
		const fileContent = await fs.readFile(file)
		const { content, data } = matter(fileContent.toString())

		const processed = await processor.process({
			path: file,
			value: content
		})

		return `<file path="${file}" meta="${JSON.stringify(data, null, 2)}">
${processed}
</file>`
	})

	const scanned = await Promise.all(scan)

	return new Response(
		`# Carbon Docs

## Other files:
API: https://carbon.buape.com/llms-api.txt
Full: https://carbon.buape.com/llms-full.txt



${scanned.join("\n\n")}`
	)
}
