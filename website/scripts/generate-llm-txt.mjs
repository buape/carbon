import { promises as fs } from "node:fs"
import path from "node:path"

const contentDir = path.resolve("content")

const walk = async (dir) => {
	const entries = await fs.readdir(dir, { withFileTypes: true })
	const files = []

	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name)
		if (entry.isDirectory()) {
			files.push(...(await walk(fullPath)))
		} else if (entry.isFile() && entry.name.endsWith(".mdx")) {
			files.push(fullPath)
		}
	}

	return files
}

const stripFrontmatter = (content) => {
	const normalized = content.replace(/\r\n/g, "\n")
	if (!normalized.startsWith("---")) return { content, meta: {} }

	const end = normalized.indexOf("\n---", 3)
	if (end === -1) return { content, meta: {} }

	const raw = normalized.slice(3, end).trim()
	const meta = {}

	for (const line of raw.split("\n")) {
		const [key, ...rest] = line.split(":")
		if (!key) continue
		const value = rest.join(":").trim()
		if (!value) continue

		const normalized = value.replace(/^['"]|['"]$/g, "")
		if (normalized === "true") meta[key.trim()] = true
		else if (normalized === "false") meta[key.trim()] = false
		else meta[key.trim()] = normalized
	}

	const nextContent = normalized.slice(end + 4).trimStart()
	return { content: nextContent, meta }
}

const formatPath = (filePath) =>
	path.relative(process.cwd(), filePath).replace(/\\/g, "/")

const main = async () => {
	const files = await walk(contentDir)
	const entries = await Promise.all(
		files.map(async (file) => {
			const raw = await fs.readFile(file, "utf-8")
			const { content, meta } = stripFrontmatter(raw)
			return `<file path="${formatPath(file)}" meta="${JSON.stringify(
				meta,
				null,
				2
			)}">\n${content.trim()}\n</file>`
		})
	)

	const output = `# Carbon Docs\nAPI Reference: https://carbon.buape.com/api.json\n\n${entries.join("\n\n")}`

	await fs.mkdir("public", { recursive: true })
	await fs.writeFile(path.join("public", "llms.txt"), `${output}\n`)
	console.log("Generated public/llms.txt")
}

main().catch((error) => {
	console.error(error)
	process.exit(1)
})
