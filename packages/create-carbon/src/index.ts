import { mkdirSync, writeFileSync } from "node:fs"
import process from "node:process"
import { ClientMode } from "@buape/carbon"
import * as p from "@clack/prompts"
import yoctoSpinner from "yocto-spinner"
import { createPackageJson } from "./tools/createPackageJson.js"
import { doesDirectoryExist, processFolder } from "./tools/files.js"
import { runPackageManagerCommand } from "./tools/runManagerCommand.js"
import { type Mode, modes } from "./modes.js"
import { getFiles, packageManager, sleep } from "./utils.js"

import { dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { debug } from "./tools/debug.js"
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

const mode = await p.select<typeof modes, Mode>({
	message: "What mode do you want to use Carbon in?",
	options: modes
})

if (p.isCancel(mode)) {
	p.outro("Cancelled")
	process.exit(1)
}

if (!doesDirectoryExist(`${__dirname}/../../templates/${mode}`)) {
	p.outro(
		`No template found for ${mode} - This is a bug! Please report it to https://github.com/buape/carbon/issues`
	)
	process.exit(1)
}

// ================================================ Per-Mode Options ================================================

const replacers: Record<string, string> = {
	name,
	packageManager: packageManager(),
	// biome-ignore lint/style/noNonNullAssertion: dates don't just not exist
	todaysDate: new Date().toISOString().split("T")[0]!
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

const linkedRoles = await p.confirm({
	message: "Would you like to add Linked Roles to your bot?"
})

if (p.isCancel(linkedRoles)) {
	p.outro("Cancelled")
	process.exit(1)
}

if (linkedRoles) {
	replacers.linkedRolesImport = `import { LinkedRoles } from "@buape/carbon-linked-roles"\n`
	replacers.linkedRolesCfEnv = `
	CLIENT_SECRET: string
	BASE_URL: string
`
	replacers.linkedRoles =
		mode === "cloudflare"
			? `
		const isAllowed = ["439223656200273932"]
		new LinkedRoles(client, {
			clientSecret: env.CLIENT_SECRET,
			baseUrl: env.BASE_URL,
			metadata: [
			{
				key: "is_staff",
				name: "Verified Staff",
				description: "Whether the user is a verified staff member",
				type: ApplicationRoleConnectionMetadataType.BooleanEqual
			},
			],
			metadataCheckers: {
				is_allowed: async (userId) => {
					if (isAllowed.includes(userId)) return true
					return false
				}
			}
		})`
			: `const isAllowed = ["439223656200273932"]

const linkedRoles = new LinkedRoles(client, {
	clientSecret: process.env.CLIENT_SECRET,
	baseUrl: process.env.BASE_URL,
	metadata: [
		{
			key: "is_staff",
			name: "Verified Staff",
			description: "Whether the user is a verified staff member",
			type: ApplicationRoleConnectionMetadataType.BooleanEqual
		},
	],
	metadataCheckers: {
		is_allowed: async (userId) => {
			if (isAllowed.includes(userId)) return true
			return false
		}
	}
})`
	replacers.linkedRolesEnv = `CLIENT_SECRET=""\nBASE_URL=""`
	replacers.linkedRolesReadme = `\n\n## Linked Roles

Since you added Linked Roles to your bot, make sure that you add the \`CLIENT_SECRET\` and \`BASE_URL\` env variables as well!

Once you have your LinkedRoles instance, you need to set it on Discord so that users will use it for linked roles. You can see where to add this by clicking here, and set the linked role to <BASE_URL>/connect, so for example, https://my-carbon-worker.YOURNAME.workers.dev/connect. You'll also need to add a redirect URL to your Discord application, so that users can be redirected to your website after they login. You can go to the OAuth tab on the dashboard and add a redirect URL there of <BASE_URL>/connect/callback, so for example, https://my-carbon-worker.YOURNAME.workers.dev/connect/callback.\n`
} else {
	replacers.linkedRolesImport = ""
	replacers.linkedRoles = ""
	replacers.linkedRolesEnv = ""
	replacers.linkedRolesReadme = ""
}

// ================================================ Create Project ================================================

const spinner = yoctoSpinner({ text: "Creating project..." })
spinner.start()

debug(`Replacers: ${JSON.stringify(replacers, null, 2)}`)

await sleep(1000) // Adding delay makes the user feel like it's actively working if it runs too fast

// ================================================ Create folder and package.json ================================================

const packageJson = createPackageJson({ replacers, mode })
const directory = mkdirSync(`${process.cwd()}/${name}`, { recursive: true })
if (!directory) {
	p.outro("Failed to create project folder")
	process.exit(1)
}
writeFileSync(`${directory}/package.json`, packageJson)

// ================================================ Copy in base Template ================================================

processFolder("_base", `${__dirname}/../../templates`, directory, replacers)

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
