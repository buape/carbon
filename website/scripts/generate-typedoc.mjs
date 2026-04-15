import { spawnSync } from "node:child_process"
import { readdir, readFile, rm, writeFile } from "node:fs/promises"
import { join, relative } from "node:path"

const pagesRoot = "pages/beta"

const targets = [
	{
		label: "@buape/carbon",
		source: "../packages/carbon/src",
		out: `${pagesRoot}/api/carbon`,
		tsconfig: "../packages/carbon/tsconfig.json"
	},
	{
		label: "create-carbon",
		source: "../packages/create-carbon/src",
		out: `${pagesRoot}/api/create-carbon`,
		tsconfig: "../packages/create-carbon/tsconfig.json"
	}
]

const titleCase = (value) =>
	value
		.replace(/[-_]/g, " ")
		.split(" ")
		.filter(Boolean)
		.map((part) => part[0].toUpperCase() + part.slice(1))
		.join(" ")

const collectJobs = async (root, dir = root) => {
	const items = await readdir(dir, { withFileTypes: true })
	const files = items
		.filter((item) => item.isFile() && item.name.endsWith(".ts"))
		.map((item) => join(dir, item.name))
		.sort()

	const jobs = files.length
		? [
				{
					relDir: relative(root, dir) === "" ? "" : relative(root, dir),
					files
				}
			]
		: []

	for (const item of items
		.filter((entry) => entry.isDirectory())
		.sort((a, b) => a.name.localeCompare(b.name))) {
		jobs.push(...(await collectJobs(root, join(dir, item.name))))
	}

	return jobs
}

const runTypedoc = ({ files, out, tsconfig }) => {
	const result = spawnSync(
		"node",
		[
			"scripts/tome-cli-shim.mjs",
			"typedoc",
			...files,
			"--output",
			out,
			"--tsconfig",
			tsconfig
		],
		{ stdio: "inherit" }
	)

	if (result.status !== 0) {
		throw new Error(`TypeDoc failed for ${out}`)
	}
}

const formatFrontmatterValue = (value) =>
	value === "true" || value === "false" ? value : JSON.stringify(value)

const updateFrontmatter = (content, updates) => {
	if (!content.startsWith("---\n")) return content
	const end = content.indexOf("\n---\n", 4)
	if (end === -1) return content

	const body = content.slice(end + 5)
	const lines = content.slice(4, end).split("\n")
	const map = new Map()

	for (const line of lines) {
		const idx = line.indexOf(":")
		if (idx === -1) continue
		map.set(line.slice(0, idx).trim(), line.slice(idx + 1).trim())
	}

	for (const [key, value] of Object.entries(updates)) {
		map.set(key, formatFrontmatterValue(value))
	}

	const next = [
		"---",
		...[...map.entries()].map(([k, v]) => `${k}: ${v}`),
		"---",
		""
	].join("\n")
	return `${next}${body}`
}

const tableRowSortKey = (line) => {
	const cells = line
		.split("|")
		.map((cell) => cell.trim())
		.filter(Boolean)

	const nameCell = cells[0] || ""
	const linkMatch = nameCell.match(/\[`?([^`\]]+)`?\]\([^)]+\)/)
	const label = linkMatch?.[1] || nameCell

	return label.toLowerCase()
}

const sortNameDescriptionTables = (content) => {
	const lines = content.split("\n")

	for (let i = 0; i < lines.length - 2; i++) {
		if (lines[i].trim() !== "| Name | Description |") continue
		if (!lines[i + 1]?.trim().startsWith("|---")) continue

		const start = i + 2
		let end = start

		while (end < lines.length && lines[end].trim().startsWith("|")) {
			end++
		}

		const rows = lines.slice(start, end)
		if (rows.length < 2) continue

		rows.sort((a, b) => tableRowSortKey(a).localeCompare(tableRowSortKey(b)))
		lines.splice(start, rows.length, ...rows)
		i = end - 1
	}

	return lines.join("\n")
}

const normalizeMultilineSignatureHeadings = (content) => {
	const lines = content.split("\n")
	const next = []

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i]
		if (!line.startsWith("## `") || line.trim().endsWith("`")) {
			next.push(line)
			continue
		}

		const signatureLines = [line.replace(/^## `/, "")]
		let j = i + 1
		let closed = false

		while (j < lines.length) {
			const current = lines[j]
			if (current.endsWith("`")) {
				signatureLines.push(current.slice(0, -1))
				closed = true
				break
			}
			signatureLines.push(current)
			j++
		}

		if (!closed) {
			next.push(line)
			continue
		}

		next.push("## Signature", "", "```ts", ...signatureLines, "```", "")
		i = j
	}

	return next.join("\n")
}

const postProcessDir = async (baseDir) => {
	const walk = async (dir) => {
		const entries = await readdir(dir, { withFileTypes: true })
		for (const entry of entries) {
			const full = join(dir, entry.name)
			if (entry.isDirectory()) {
				await walk(full)
				continue
			}
			if (!entry.name.endsWith(".md")) continue

			const rel = relative(baseDir, full)
			const parts = rel.split("/")
			const isIndex = parts.at(-1) === "index.md"
			let content = await readFile(full, "utf8")

			if (isIndex) {
				const packageName =
					parts[0] === "carbon" ? "@buape/carbon" : "create-carbon"
				const section = parts.slice(1, -1)
				const sectionLabel = section.length
					? section.map(titleCase).join(" / ")
					: "Overview"
				const title = `${packageName} API · ${sectionLabel}`
				content = updateFrontmatter(content, {
					title,
					sidebarTitle: section.length ? titleCase(section.at(-1)) : "Overview"
				})
				content = content.replace("# API Reference", `# ${title}`)
				content = sortNameDescriptionTables(content)
			} else {
				content = updateFrontmatter(content, { hidden: "true" })
			}

			content = normalizeMultilineSignatureHeadings(content)

			await writeFile(full, content)
		}
	}

	await walk(baseDir)
}

await rm(`${pagesRoot}/api/carbon`, { recursive: true, force: true })
await rm(`${pagesRoot}/api/create-carbon`, { recursive: true, force: true })

for (const target of targets) {
	const jobs = await collectJobs(target.source)
	for (const job of jobs) {
		const out = job.relDir ? join(target.out, job.relDir) : target.out
		runTypedoc({ files: job.files, out, tsconfig: target.tsconfig })
	}
}

await postProcessDir(`${pagesRoot}/api`)
