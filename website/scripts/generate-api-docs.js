#!/usr/bin/env node

import { promises as fs } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))

const inputDir = resolve(__dirname, "../../packages/carbon/docs")
const publicDir = resolve(__dirname, "../public")
const apiJsonPath = join(inputDir, "api.json")

try {
	await fs.access(apiJsonPath)
} catch (error) {
	console.error(
		"API JSON file not found. Make sure TypeDoc has generated docs/api.json"
	)
	console.error("Error:", error.message)
	process.exit(1)
}

try {
	await fs.copyFile(apiJsonPath, join(publicDir, "api.json"))
	console.log("API documentation setup complete!")
} catch (error) {
	console.error("Failed to copy file:", error.message)
	process.exit(1)
}
