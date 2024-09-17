import process from "node:process"
import { ClientMode } from "@buape/carbon"
import * as p from "@clack/prompts"
import { allModesPretty, getFiles, packageManager, sleep } from "./utils.js"
import yoctoSpinner from "yocto-spinner"
import { mkdirSync, writeFileSync } from "node:fs"
import { createPackageJson } from "./tools/createPackageJson.js"
import { runPackageManagerCommand } from "./tools/runManagerCommand.js"
import { processFolder, writeFile, doesDirectoryExist } from "./tools/files.js"

import { dirname } from "node:path"
import { fileURLToPath } from "node:url"
const __dirname = dirname(fileURLToPath(import.meta.url))

// ================================================ Intro ================================================

p.intro("Welcome to Carbon!")

const name = await p.text({
	message: "What is the name of your project?",
	placeholder: "my-carbon-bot",
	validate: (value) => {
		if (!value) return "You must provide a project name!"
		if (!value.match(/^[a-z0-9-_]+$/))
			return "Your project name can only contain lowercase letters, numbers, dashes, and underscores!"
		if (doesDirectoryExist(value))
			return "A directory with that name already exists!"
	}
})
if (p.isCancel(name)) {
	p.outro("Cancelled")
	process.exit(1)
}

const mode = await p.select<typeof allModesPretty, ClientMode>({
	message: "What mode do you want to use Carbon in?",
	options: allModesPretty
})

if (p.isCancel(mode)) {
	p.outro("Cancelled")
	process.exit(1)
}

// ================================================ Per-Mode Options ================================================

const replacers: Record<string, string> = {
	name,
	packageManager: packageManager()
}

if (mode === ClientMode.Bun) {
	const options = await p.group(
		{
			port: async () =>
				(
					await p.text({
						message: "What port do you want to run your bot on?",
						placeholder: "3000",
						validate: (value) => {
							if (!Number.isSafeInteger(Number(value)))
								return "Port must be a number!"
							if (Number(value) < 1024) return "Port must be greater than 1024!"
							if (Number(value) > 65535) return "Port must be less than 65535!"
						}
					})
				).toString()
		},
		{
			onCancel: () => {
				p.outro("Cancelled")
				process.exit(1)
			}
		}
	)
	replacers.port = options.port
} else if (mode === ClientMode.NodeJS) {
	const options = await p.group(
		{
			port: async () =>
				(
					await p.text({
						message: "What port do you want to run your bot on?",
						placeholder: "3000",
						validate: (value) => {
							if (!Number.isSafeInteger(Number(value)))
								return "Port must be a number!"
							if (Number(value) < 1024) return "Port must be greater than 1024!"
							if (Number(value) > 65535) return "Port must be less than 65535!"
						}
					})
				).toString()
		},
		{
			onCancel: () => {
				p.outro("Cancelled")
				process.exit(1)
			}
		}
	)
	replacers.port = options.port
}

// ================================================ Create Project ================================================

const spinner = yoctoSpinner({ text: "Creating project..." })
spinner.start()

await sleep(1000)

// ================================================ Create folder and package.json ================================================

const packageJson = createPackageJson({ name, mode })
const directory = mkdirSync(`${process.cwd()}/${name}`, { recursive: true })
if (!directory) {
	p.outro("Failed to create project folder")
	process.exit(1)
}
writeFileSync(`${directory}/package.json`, packageJson)

// ================================================ Copy in base Template ================================================

const baseTemplateFolder = `${__dirname}/../../templates/_base`
const baseTemplateFiles = getFiles(baseTemplateFolder, "")

for (const file of baseTemplateFiles) {
	writeFile(file, baseTemplateFolder, directory, replacers)
}

// ================================================ Copy in mode template - root files ================================================

const templateFolderPath = `${__dirname}/../../templates/${mode}`
const allInTemplateFolder = getFiles(templateFolderPath, "")
if (!allInTemplateFolder) {
	p.outro(`Failed to find template folder for ${mode}`)
	process.exit(1)
}

processFolder(mode, `${__dirname}/../../templates`, directory, replacers)

// ================================================ Copy in mode template - subfolders ================================================

const templateFolders = allInTemplateFolder.filter((x) => !x.includes("."))
for (const templateFolder of templateFolders) {
	processFolder(
		templateFolder,
		templateFolderPath,
		`${directory}/${templateFolder}`,
		replacers
	)
}

// ================================================ End template copy ================================================
spinner.stop()

// ================================================ Install Dependencies ================================================
const doInstall = await p.confirm({
	message: "Would you like to automatically install dependencies?"
})
if (p.isCancel(doInstall)) {
	p.outro("Cancelled")
	process.exit(1)
}
if (doInstall === true) {
	const depsSpinner = yoctoSpinner({ text: "Installing dependencies..." })
	depsSpinner.start()
	await runPackageManagerCommand("install", directory)
	depsSpinner.stop()
}

// ================================================ Done ================================================
p.outro("Done!")
