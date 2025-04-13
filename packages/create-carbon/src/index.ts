#! /usr/bin/env node

import * as p from "@clack/prompts"
import yoctoSpinner from "yocto-spinner"
import { type Runtime, runtimes, serverRuntimes } from "./runtimes.js"
import { doesDirectoryExist } from "./tools/fileSystem.js"
import {
	getPackageManager,
	runPackageManagerCommand
} from "./tools/packageManager.js"
import { processTemplate } from "./tools/templateProcessor.js"

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

const runtime = await p.select<Runtime>({
	message: "What runtime do you want to use?",
	options: runtimes
})
if (p.isCancel(runtime)) {
	p.outro("Cancelled")
	process.exit(1)
}

const gateway = serverRuntimes.includes(runtime)
	? await p.confirm({
			message:
				"Would you like to add gateway events (non-HTTP interaction events) to your app? This will require an active websocket connection alongside the normal HTTP server.",
			initialValue: false
		})
	: false
if (p.isCancel(gateway)) {
	p.outro("Cancelled")
	process.exit(1)
}

const linkedRoles = await p.confirm({
	message: "Would you like to add linked roles to your app?",
	initialValue: false
})
if (p.isCancel(linkedRoles)) {
	p.outro("Cancelled")
	process.exit(1)
}

// ================================================ Create Project ================================================

const spinner = yoctoSpinner({ text: "Creating project..." })
spinner.start()

const packageManager = getPackageManager()
await processTemplate({
	name,
	runtime,
	packageManager,
	todaysDate: new Date().toISOString().split("T")[0] ?? "",
	plugins: { linkedRoles, gateway }
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
	depsSpinner.stop()
}

// ================================================ Done ================================================
p.outro("Done!")
