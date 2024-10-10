import { statSync } from "node:fs"

/**
 * Check if a directory exists
 * @param name The name of the directory to check
 */
export const doesDirectoryExist = (name: string) => {
	try {
		if (statSync(`${name}`).isDirectory()) return true
		return false
	} catch (_e) {
		return false
	}
}
