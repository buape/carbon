import path from "node:path"
import type { BaseCommand } from "@buape/carbon"
import { getFiles } from "./utils.js"

/**
 * Load commands from a folder.
 *
 * This folder should be structured as follows:
 * ```
 * commands
 * ├── parentFolder
 * │   ├── command1.js
 * │   └── command2.js
 * ├── command3.js
 * └── command4.js
 * ```
 *
 * In this example, `command1.js` and `command2.js` are in a parent folder, while `command3.js` and `command4.js` are in the main folder.
 * The parent folder is used to group commands together, but it is not required. If you do not want to group commands, you can put them in the main folder.
 *
 * To load commands with this example, you would use loadCommands("commands", __dirname).
 *
 * @param folderPath - The path to the main command folder
 * @param dirname - The name of the main directory of your application. If you are using ES Modules, this can be found with the following code:
 * ```js
 * import { fileURLToPath } from "node:url"
 * import { dirname } from "node:path"
 * const __dirname = dirname(fileURLToPath(import.meta.url))
 * ```
 * @returns The loaded commands
 */
export const loadCommands = async (folderPath: string, dirname: string) => {
	const commands: BaseCommand[] = []
	const mainFolderPath = path.join(dirname, folderPath)

	const parentFolderNames = getFiles(mainFolderPath, "", true)

	const parentFolders = parentFolderNames.filter(
		(folder) => !folder.includes(".")
	)
	const parentFolderFiles = parentFolderNames.filter((folder) =>
		folder.endsWith(".js")
	)

	for await (const fileName of parentFolderFiles) {
		const filePath = path.join(mainFolderPath, fileName)
		const fileUrl = `file://${filePath.replace(/\\/g, "/")}`
		const file = await import(fileUrl)
		const cmd = new file.default()
		commands.push(cmd)
	}

	for (const parentFolder of parentFolders) {
		const files = getFiles(path.join(mainFolderPath, parentFolder), "js")
		for await (const fileName of files) {
			const filePath = path.join(mainFolderPath, parentFolder, fileName)
			const fileUrl = `file://${filePath.replace(/\\/g, "/")}`
			const file = await import(fileUrl)
			const cmd = new file.default()
			commands.push(cmd)
		}
	}
	return commands
}
