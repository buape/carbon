import {
	mkdirSync,
	readFileSync,
	readdirSync,
	statSync,
	writeFileSync
} from "node:fs"
import { dirname, resolve } from "node:path"
import matter from "gray-matter"
import Handlebars from "handlebars"
import type { Runtime } from "../runtimes.js"
import { debug } from "./consoleDebug.js"
import { getDependencyVersions } from "./npmHelpers.js"

// a == b
Handlebars.registerHelper(
	"eq", //
	(a, b) => a === b
)
// a || b || c || d || e || f
Handlebars.registerHelper(
	"or", //
	(...args) => args.slice(0, -1).some(Boolean)
)
// Needed for accessing object properties with invalid names (e.g. @ / -)
// k ? o[k] : undefined
Handlebars.registerHelper(
	"get", //
	(o, k) => (k ? o[k] : undefined)
)

interface TemplateContext {
	name: string
	runtime: Runtime
	packageManager: string
	todaysDate: string
	plugins: Record<"linkedRoles" | "gateway", boolean>
	versions: Record<string, string>
}

interface FrontMatter extends Record<string, string | undefined> {
	path?: string
}

/**
 * Processes the template using the provided context
 * @param context The context to use for the compilation
 */
export const processTemplate = async (
	context: Omit<TemplateContext, "versions">
) => {
	const templatePath = resolve(import.meta.dirname, "../../../template")
	debug("Processing template")
	debug("Getting dependency versions")
	const packageVersions = await getDependencyVersions()
	const jointContext = { ...context, versions: packageVersions }
	debug("Using context", jointContext)
	processFolder(templatePath, jointContext)
	debug("Template processed")
}

/**
 * Processes a folder, recursively processing all files and folders within it
 * @param path The path of the folder to process
 * @param context The context to use for the compilation
 */
const processFolder = (path: string, context: TemplateContext) => {
	for (const item of readdirSync(path)) {
		const itemPath = resolve(path, item)
		const stats = statSync(itemPath)
		if (stats.isDirectory()) {
			processFolder(itemPath, context)
		} else if (stats.isFile()) {
			processFile(itemPath, context)
		}
	}
}

/**
 * Processes a file using Handlebars and writes it to the output directory
 * @param path The path of the file to process
 * @param context The context to use for the compilation
 */
const processFile = (path: string, context: TemplateContext) => {
	const ext = path.split(".").pop()
	let result = undefined

	// Skip non-forwarder templates for forwarder runtime
	if (
		context.runtime === "forwarder" &&
		!path.includes("forwarder") &&
		!path.includes("package.json")
	) {
		return debug(`Skipping non-forwarder file ${path} for forwarder runtime`)
	}

	if (ext === "hbs") result = compileHbsFile(path, context)
	else if (ext === "json") result = compileJsonFile(path, context)
	else return debug(`Ignoring file ${path}`)
	if (!result.meta.path) return debug(`Skipping file ${path}`)

	const outPath = resolve(process.cwd(), context.name, result.meta.path)
	mkdirSync(dirname(outPath), { recursive: true })
	debug(`Writing file to ${outPath}`)
	writeFileSync(outPath, result.body)
}

const compileHbsFile = (path: string, context: TemplateContext) => {
	debug(`Compiling Handlebars file ${path}`)
	const source = readFileSync(path, "utf-8")
	const template = Handlebars.compile(source)
	const body = template(context)
	const { content, data } = matter(body)
	return {
		body: content.trim().replace(/\n{3,}/g, "\n\n"),
		meta: data as FrontMatter
	}
}

const compileJsonFile = (path: string, context: TemplateContext) => {
	debug(`Reading JSON file ${path}`)
	const source = readFileSync(path, "utf-8")
	const { runtimeEquals, templatePath, outputPath } = JSON.parse(source)
	if (runtimeEquals && context.runtime !== runtimeEquals)
		return { body: "", meta: {} }
	const body = readFileSync(resolve(dirname(path), templatePath))
	return { body, meta: { path: String(outputPath) } }
}
