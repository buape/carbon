import * as p from "@clack/prompts"
import { type Runtime, runtimes } from "./runtimes.js"
import { doesDirectoryExist } from "./tools/fileSystem.js"
import yoctoSpinner from "yocto-spinner"
import { processTemplate } from "./tools/templateCreator.js"
import {
	getPackageManager,
	runPackageManagerCommand
} from "./tools/packageManager.js"

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

const runtime = await p.select<typeof runtimes, Runtime>({
	message: "What runtime do you want to use?",
	options: runtimes
})
if (p.isCancel(runtime)) {
	p.outro("Cancelled")
	process.exit(1)
}

const enableLinkedRoles = await p.confirm({
	message: "Would you like to enable linked roles?",
	initialValue: false
})
if (p.isCancel(enableLinkedRoles)) {
	p.outro("Cancelled")
	process.exit(1)
}

// ================================================ Create Project ================================================

const spinner = yoctoSpinner({ text: "Creating project..." })
spinner.start()

const packageManager = getPackageManager()
await processTemplate({
	name: name,
	runtime: runtime,
	packageManager: packageManager,
	plugins: { linkedRoles: enableLinkedRoles }
})

spinner.stop()

// ================================================ Install Dependencies ================================================

const doInstall = await p.confirm({
	message: `Would you like to automatically install dependencies with ${packageManager}?`,
	initialValue: true
})
if (p.isCancel(doInstall)) {
	p.outro("Cancelled")
	process.exit(1)
}

if (doInstall === true) {
	const depsSpinner = yoctoSpinner({ text: "Installing dependencies..." })
	depsSpinner.start()
	await runPackageManagerCommand("install", name)
}

// ================================================ Done ================================================
p.outro("Done!")
