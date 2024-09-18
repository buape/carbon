import {
	mkdirSync,
	readFileSync,
	rmdirSync,
	statSync,
	unlinkSync,
	writeFileSync
} from "node:fs"
import { getFiles, replacePlaceholders } from "../utils.js"
import { debug } from "./debug.js"

export const doesDirectoryExist = (name: string) => {
	try {
		if (statSync(`${name}`).isDirectory()) return true
		return false
	} catch (_e) {
		return false
	}
}

export const writeFile = (
	file: string,
	templateFolder: string,
	outputDirectory: string,
	replacers: Record<string, string>
) => {
	debug(`Copying ${file} to ${outputDirectory} from ${templateFolder}`)
	const fileName = file.replace(".template", "")
	const template = readFileSync(`${templateFolder}/${file}`, "utf-8")
	const data = replacePlaceholders(template, replacers)
	writeFileSync(`${outputDirectory}/${fileName}`, data)
}
export const processFolder = (
	folder: string,
	root: string,
	outputRoot: string,
	replacers: Record<string, string>
) => {
	try {
		mkdirSync(`${outputRoot}`)
	} catch {}
	const thisFolderPath = `${root}/${folder}`
	const all = getFiles(thisFolderPath, "")
	const folders = all.filter((x) => !x.includes("."))
	const templates = all.filter((x) => x.endsWith(".template"))
	const appenders = all.filter((x) => x.endsWith(".appender"))
	const excludes = all.filter((x) => x.endsWith(".exclude"))
	for (const template of templates) {
		writeFile(template, thisFolderPath, outputRoot, replacers)
	}
	for (const appender of appenders) {
		appendFile(appender, thisFolderPath, outputRoot, replacers)
	}
	for (const exclude of excludes) {
		excludeFile(exclude, thisFolderPath, outputRoot)
	}
	for (const folder of folders) {
		processFolder(folder, thisFolderPath, `${outputRoot}/${folder}`, replacers)
	}
}
export const appendFile = (
	file: string,
	templateFolder: string,
	outputDirectory: string,
	replacers: Record<string, string>
) => {
	debug(`Copying ${file} to ${outputDirectory} from ${templateFolder}`)
	const fileName = file.replace(".appender", "")
	const original = readFileSync(`${outputDirectory}/${fileName}`, "utf-8")
	const template = readFileSync(`${templateFolder}/${file}`, "utf-8")
	const newTemplate = `${original}\n${template}`
	const data = replacePlaceholders(newTemplate, replacers)
	writeFileSync(`${outputDirectory}/${fileName}`, data)
}
export const excludeFile = (
	file: string,
	templateFolder: string,
	outputDirectory: string
) => {
	debug(
		`Deleting ${file} from ${outputDirectory} because of exclude in ${templateFolder}`
	)
	const fileName = file.replace(".exclude", "")
	try {
		rmdirSync(`${outputDirectory}/${fileName}`, { recursive: true })
		unlinkSync(`${outputDirectory}/${fileName}`)
	} catch {
		debug(`Exclude ${outputDirectory}/${fileName} not found`)
	}
}
