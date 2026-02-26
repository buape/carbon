import assert from "node:assert/strict"
import { promises as fs } from "node:fs"
import path from "node:path"
import { test } from "node:test"

const contentDir = path.resolve("content")

const walk = async (dir, predicate) => {
	const entries = await fs.readdir(dir, { withFileTypes: true })
	const results = []

	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name)
		if (entry.isDirectory()) {
			results.push(...(await walk(fullPath, predicate)))
		} else if (predicate(entry.name)) {
			results.push(fullPath)
		}
	}

	return results
}

const fileExists = async (filePath) => {
	try {
		await fs.access(filePath)
		return true
	} catch {
		return false
	}
}

test("content contains mdx pages", async () => {
	const mdxFiles = await walk(contentDir, (name) => name.endsWith(".mdx"))
	assert.ok(mdxFiles.length > 0, "No MDX files found in content/")
})

test("meta.json page lists point to real content", async () => {
	const metaFiles = await walk(contentDir, (name) => name === "meta.json")
	const missing = []

	for (const metaFile of metaFiles) {
		const raw = await fs.readFile(metaFile, "utf-8")
		const meta = JSON.parse(raw)
		const pages = Array.isArray(meta.pages) ? meta.pages : []
		const baseDir = path.dirname(metaFile)

		for (const entry of pages) {
			if (entry === "...") continue
			const directFile = path.join(baseDir, `${entry}.mdx`)
			const indexFile = path.join(baseDir, entry, "index.mdx")
			const metaPath = path.join(baseDir, entry, "meta.json")

			if (
				!(await fileExists(directFile)) &&
				!(await fileExists(indexFile)) &&
				!(await fileExists(metaPath))
			) {
				missing.push({ metaFile, entry })
			}
		}
	}

	assert.deepEqual(
		missing,
		[],
		`meta.json references missing entries: ${JSON.stringify(missing, null, 2)}`
	)
})
