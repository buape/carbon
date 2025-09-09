import * as fs from "node:fs/promises"
import * as path from "node:path"
import fg from "fast-glob"
import { remarkInclude } from "fumadocs-mdx/config"
import matter from "gray-matter"
import { remark } from "remark"
import remarkGfm from "remark-gfm"
import remarkMdx from "remark-mdx"
import remarkStringify from "remark-stringify"

const processor = remark()
	.use(remarkMdx)
	.use(remarkInclude)
	.use(remarkGfm)
	.use(remarkStringify)

const generateTxt = async (filePaths, outputName) => {
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

	const txtContent = `# Carbon Docs
API Reference: https://carbon.buape.com/api.json

${scanned.join("\n\n")}`

	const outputPath = path.join("public", outputName)
	await fs.writeFile(outputPath, txtContent)
	console.log(`Generated ${outputPath}`)
}

async function main() {
	await fs.mkdir("public", { recursive: true })
	const allPath = await fg(["content/**/*.mdx"])
	await generateTxt(allPath, "llms.txt")
}

main().catch(console.error)
