import { existsSync, mkdirSync, readdirSync } from "node:fs"

export const packageManager = () => {
	const versions = process.versions
	if (versions.bun) {
		return "bun"
	}
	const userAgent = process.env.npm_config_user_agent
	if (userAgent) {
		if (userAgent.startsWith("yarn")) return "yarn"
		if (userAgent.startsWith("pnpm")) return "pnpm"
		if (userAgent.startsWith("bun")) return "bun"
	}

	return "npm"
}

export const sleep = async (ms: number) => {
	return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Get all the files in all the subdirectories of a directory.
 * @param directory - The directory to get the files from.
 * @param fileExtension - The extension to search for.
 * @param createDirIfNotFound - Whether or not the parent directory should be created if it doesn't exist.
 * @returns The files in the directory.
 */
export const getFiles = (
	directory: string,
	fileExtension: string,
	createDirIfNotFound = false
): string[] => {
	if (createDirIfNotFound && !existsSync(directory)) mkdirSync(directory)
	return readdirSync(directory).filter((file) => file.endsWith(fileExtension))
}

export const replacePlaceholders = (
	template: string,
	data: Record<string, string>
) => {
	let result = template
	for (const [key, value] of Object.entries(data)) {
		result = result.replace(`{{${key}}}`, value.toString())
	}
	return result
}

export const titleCase = (str: string) => {
	return str.replace(/\w\S*/g, (txt) => {
		return txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
	})
}
