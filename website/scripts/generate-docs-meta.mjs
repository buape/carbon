import { promises as fs } from "node:fs"
import path from "node:path"

const contentDir = path.resolve("content")
const outputPath = path.resolve("src/content/last-updated.json")

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

const formatPath = (filePath) =>
	path.relative(contentDir, filePath).replace(/\\/g, "/")

const main = async () => {
	const files = await walk(contentDir)
	const payload = {}

	for (const file of files) {
		const stats = await fs.stat(file)
		payload[formatPath(file)] = stats.mtime.toISOString()
	}

	await fs.mkdir(path.dirname(outputPath), { recursive: true })
	await fs.writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`)
	console.log(`Generated ${path.relative(process.cwd(), outputPath)}`)
}

main().catch((error) => {
	console.error(error)
	process.exit(1)
})
