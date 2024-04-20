import path from "node:path"
import type { BaseCommand } from "@buape/carbon"
import { getFiles } from "./utils.js"

/**
 * Load commands from a folder.
 *
 * This folder should be structured as follows:
 * ```
 * commands
 * ├── parentFolder1
 * │   ├── command1.js
 * │   └── command2.js
 * └── parentFolder2
 *     ├── command3.js
 *     └── command4.js
 * ```
 *
 * In this example, the `commands` folder contains two parent folders, each containing two command files.
 * The default export of each command file should be the command class you are wanting to load.
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

	const parentFolders = getFiles(mainFolderPath, "", true)

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
