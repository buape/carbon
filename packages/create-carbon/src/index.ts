#! /usr/bin/env node

import * as p from "@clack/prompts"
import { type Runtime, runtimes } from "./runtimes.js"
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
const projectName = name as string

const runtime = await p.select<Runtime>({
	message: "What runtime do you want to use?",
	options: runtimes
})
if (p.isCancel(runtime)) {
	p.outro("Cancelled")
	process.exit(1)
}
const selectedRuntime = runtime as Runtime

const gatewayCapableRuntimes: Runtime[] = ["node", "bun", "cloudflare"]
const wantsGateway = gatewayCapableRuntimes.includes(selectedRuntime)
	? await p.confirm({
			message:
				selectedRuntime === "cloudflare"
					? "Would you like to add gateway events (non-HTTP interaction events) to your app?"
					: "Would you like to add gateway events (non-HTTP interaction events) to your app? This will require an active websocket connection alongside the normal HTTP server.",
			initialValue: false
		})
	: false
if (p.isCancel(wantsGateway)) {
	p.outro("Cancelled")
	process.exit(1)
}
const addGateway = wantsGateway as boolean

const wantsCloudflareGatewayDurableObject =
	selectedRuntime === "cloudflare" && addGateway
		? await p.confirm({
				message:
					"Would you like to use Durable Objects for gateway support on Cloudflare Workers?",
				initialValue: true
			})
		: false
if (p.isCancel(wantsCloudflareGatewayDurableObject)) {
	p.outro("Cancelled")
	process.exit(1)
}
const addCloudflareGatewayDurableObject =
	wantsCloudflareGatewayDurableObject as boolean

const gateway =
	addGateway &&
	(selectedRuntime !== "cloudflare" || addCloudflareGatewayDurableObject)

const linkedRoles =
	selectedRuntime !== "forwarder"
		? await p.confirm({
				message: "Would you like to add linked roles to your app?",
				initialValue: false
			})
		: false
if (p.isCancel(linkedRoles)) {
	p.outro("Cancelled")
	process.exit(1)
}
const addLinkedRoles = linkedRoles as boolean

// ================================================ Create Project ================================================

p.log.step("Creating project...")
const packageManager = getPackageManager()
await processTemplate({
	name: projectName,
	runtime: selectedRuntime,
	packageManager,
	todaysDate: new Date().toISOString().split("T")[0] ?? "",
	plugins: { linkedRoles: addLinkedRoles, gateway }
})
p.log.success("Project created")

// ================================================ Install Dependencies ================================================

const doInstall =
	selectedRuntime === "deno"
		? false
		: await p.confirm({
				message: `Would you like to automatically install dependencies with ${packageManager}?`,
				initialValue: true
			})
if (p.isCancel(doInstall)) {
	p.outro("Cancelled")
	process.exit(1)
}

if (doInstall === true) {
	p.log.step("Installing dependencies...")
	await runPackageManagerCommand("install", projectName)
	p.log.success("Dependencies installed")
}

// ================================================ Done ================================================
p.outro("Done!")
