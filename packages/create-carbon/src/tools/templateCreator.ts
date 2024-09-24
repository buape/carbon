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
	(a, b, c, d, e, f) => a || b || c || d || e || f
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
	plugins: Record<"linkedRoles", boolean>
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
	const templatePath = resolve(__dirname, "../../template")
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
	const source = readFileSync(path, "utf-8")
	const { body, meta } = compileFile(source, context)
	if (!meta.path) return // Skip files without a path
	const outPath = resolve(process.cwd(), context.name, meta.path)
	mkdirSync(dirname(outPath), { recursive: true })
	debug(`Writing file to ${outPath}`)
	writeFileSync(outPath, body)
}

/**
 * Compiles a file using Handlebars and extracts the front matter
 * @param source The source of the Handlebars file
 * @param context The context to use for the compilation
 * @returns The compiled body and the front matter metadata
 */
const compileFile = (source: string, context: TemplateContext) => {
	const template = Handlebars.compile(source)
	const built = template(context)
	const { content, data } = matter(built)
	return { body: `${content.trim()}\n`, meta: data as FrontMatter }
}
